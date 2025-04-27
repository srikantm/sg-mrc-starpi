import {} from "mongoose";
import { getOldUserModel } from "../../../schemas/user";
import axios from "axios";
import { kebabCase } from "lodash";

const slugify = (text) => kebabCase(text.replace(/&/g, "-and-"));
const genderEnum = ["male", "female", "other"];
const checkIfNull = (data) => {
  for (const key in data) {
    if (!data[key]) {
      return false;
    }
  }
  return true;
};
const getOrCreate = async (service, filters, data) => {
  let dbObject: any;
  if (!checkIfNull(filters)) {
    return {};
  }
  dbObject = await strapi.entityService.findMany(service, {
    filters,
  });
  if (dbObject.length > 0) {
    // console.log("GETTER");
    return dbObject[0];
  }
  dbObject = await strapi.entityService.create(service, {
    data: data,
  });
  // console.log(dbObject, data, "hellllllllll");
  return dbObject;
};

const updateOrCreate = async (service, filters, data) => {
  if (!checkIfNull(filters)) {
    return {};
  }
  let dbObject;
  const existedPhrObject = await strapi.entityService.findMany(service, {
    filters,
  });
  if (!existedPhrObject.length) {
    dbObject = await strapi.entityService.create(service, {
      data,
    });
  } else {
    dbObject = await strapi.entityService.update(
      service,
      existedPhrObject[0].id,
      {
        data,
      }
    );
  }
  return dbObject;
};

export default () => ({
  restoreUser: async (userId = undefined, filter = undefined) => {
    let user;
    const userModel = await getOldUserModel({ strapi });
    if (userId) {
      user = await userModel.find({ id: userId }).exec();
    } else if (filter) {
      user = await userModel.find(filter).exec();
    } else {
      user = await userModel.find({ restoreStatus: 0 }).exec();
    }
    if (!user && !user.length) {
      return;
    }
    console.log(user, "user[0].id");
    const resp: any = await axios.get(
      `https://app.yoursilvergenie.com/users/${user[0].id}`
    );
    // console.log(resp.data, "resp.data");
    let updateQuery;
    updateQuery = await userModel.updateOne(
      { email: user[0].email },
      { restoreStatus: 3 }
    );
    const userDetails = resp.data;
    // console.log(userDetails.id, "userDetails");
    const uniqueKey = slugify(`${userDetails.email} ${userDetails.first_name}`);
    const address = {
      state: userDetails.state || "-",
      city: userDetails.city || "-",
      streetAddress: userDetails.address || "-",
      postalCode: "-",
      country: "IN",
    };
    if (!userDetails.email) {
      return;
    }

    const data: any = {
      firstName: userDetails.first_name ?? "NA",
      email: userDetails.email || "NA",
      username: userDetails.username,
      lastName: userDetails.last_name ?? " ",
      phoneNumber:
        userDetails.phone_no?.length < 10 || !userDetails.phone_no
          ? Array(10).fill("-").join("")
          : userDetails.phone_no?.slice(0, 20),
      // gender:  userDetails.gender,
      uniqueKey,
      dateOfBirth: userDetails.dob ?? "2023-10-02",
      role: {
        set: [1],
      },
      address,
    };

    const createdUser = await strapi
      .service("api::user-detail.user-detail")
      .updateOrCreateUser(
        {
          username: userDetails.username,
        },
        data
      );

    const userSub = await updateOrCreate(
      "api::user-subscription.user-subscription",
      {
        user: createdUser.id,
      },
      {
        user: {
          set: [createdUser.id],
        },
        subscription_plan: {
          set: [7],
        },
      }
    );
    let userPhr: any = {};
    if (userDetails.phr?.id) {
      // userPhr = await axios.get(
      //   `https://app.yoursilvergenie.com/phrs?id=${userDetails.phr?.id}`
      // );
      // userPhr = userPhr.data;
      if (!userPhr.length) {
        userPhr = await axios.get(
          `https://app.yoursilvergenie.com/phrs/${userDetails.phr?.id}`
        );
        userPhr = userPhr.data;
      }
      // userPhr = userPhr[0];
    }

    const chronicCondition: any = [];
    const vaccineRecords: any = [];
    const diagnosedServices: any = [];
    const medicalConditions: any = [];
    const covidVaccines: any = [];
    const fitnessRegime: any = {};
    const prescription: any = [];
    const allergies: any = [];
    let additionalInformation: any = "";

    const emergencyContacts: any = [];
    const UserInsurance: any = [];
    const preferredServices: any = [];

    for (const cc of userPhr.user_chronics ?? []) {
      const strapiCC = await getOrCreate(
        "api::chronic.chronic",
        {
          name: {
            $containsi: cc.chronic_type?.toLowerCase(),
          },
        },
        {
          name: cc.chronic_type,
        }
      );
      if (cc.chronic_value) {
        chronicCondition.push({
          condition: {
            set: [strapiCC.id],
          },
          value: cc.chronic_value,
          diagnosedDate: cc.chronic_diagnosed_date,
          description: cc.chronic_description,
        });
      }
    }

    for (const vr of userPhr.user_vaccine_records ?? []) {
      vaccineRecords.push({
        name: vr.vaccine_name,
        givenBy: vr.vaccine_given_by,
        vaccinationDate: vr.vaccine_date,
      });
    }

    for (const ds of userPhr.diag_services ?? []) {
      // console.log("🚀 ~ file: oldSync.ts:164 ~ restoreUser: ~ ds:", ds);
      const serviceProvider = await getOrCreate(
        "api::diagnostic-service-vendor.diagnostic-service-vendor",
        {
          name: {
            $containsi:
              ds.diag_service_provider?.diag_service_provider_name ||
              ds.diag_service_provider_name,
          },
        },
        {
          name:
            ds.diag_service_provider?.diag_service_provider_name ||
            ds.diag_service_provider_name,
        }
      );
      const DiagService = await getOrCreate(
        "api::diagnostic-service.diagnostic-service",
        {
          name: {
            $containsi:
              ds.diag_service_test?.diag_service_test_name?.toLowerCase() ||
              ds.diag_service_name?.toLowerCase(),
          },
        },
        {
          name:
            ds.diag_service_test?.diag_service_test_name?.toLowerCase() ||
            ds.diag_service_name?.toLowerCase(),
        }
      );
      diagnosedServices.push({
        serviceName: {
          set: DiagService ? [DiagService.id] : undefined,
        },
        serviceProvider: {
          set: serviceProvider ? [serviceProvider.id] : undefined,
        },
        value: ds.diag_sevice_result?.slice(0, 499) ?? "-",
        diagnosedDate: ds.diag_service_date,
        description: ds.chronic_description?.slice(0, 499) ?? "-",
      });
    }
    for (const vr of userPhr.covid_vaccinations ?? []) {
      covidVaccines.push({
        vaccineName: vr.covid_vaccination_name,
        admissionSite: vr.covid_vaccination_admin_site,
        Shot: "First",
        shotDate: vr.covid_vaccination_shot1,
      });
    }
    for (const vr of userPhr.fitnessregimes ?? []) {
      // fitnessRegime.fitnessLevel = vr.fitness_regime_name;
      fitnessRegime.description = vr.fitness_regime_description;
    }
    for (const vr of userPhr.user_allergies ?? []) {
      allergies.push({
        allergyType: vr.user_allergy_type ?? "-",
        alleryComponent: vr.user_allergy_component ?? "-",
        description: vr.user_allergy_description,
        diagnosedDate: vr.allergy_diagnosed_on,
      });
    }
    for (const vr of userPhr.medical_conditions ?? []) {
      medicalConditions.push({
        description: `${vr.medical_contidion_name ?? ""} - ${
          vr.medical_condition_description
        }`.slice(0, 500),
        conditionType: vr.medical_condition_type?.toLowerCase(),
        diagnosedValue: "-",
      });
    }
    for (const vr of userPhr.phr_prescriptions ?? []) {
      const alternateMedicine = [];
      const Medicine = [];
      for (const md of vr.medicines) {
        Medicine.push({
          name: md.medicine_name || "-",
          dose: md.dose || "-",
          Dosage: md.dosage || "-",
          schedule: "-",
          Duration: md.duration || "-",
          // medicineType: md.medicine_type??.toLowerCase(),
        });
      }
      for (const md of vr.alternative_medicines) {
        alternateMedicine.push({
          name: md.medicine_name || "-",
          dose: md.dose || "-",
          Dosage: md.dosage || "-",
          schedule: "-",
          Duration: md.duration || "-",
          // medicineType: md.medicine_type??.toLowerCase(),
        });
      }
      prescription.push({
        alternateMedicine,
        Medicine,
        prescriptionDate: vr.prescription_date || "-",
        prescribedBy: vr.prescribed_by || "-",
      });
    }

    for (const vr of userPhr.additional_informations ?? []) {
      additionalInformation =
        additionalInformation + vr.additional_information_description;
    }
    // console.log(additionalInformation);
    if (userDetails.phr?.id) {
      const phrData = {
        address,
        uniqueKey,
        // bloodGroup: userPhr.blood_group,
        firstName: userPhr.firstName ?? "NA",
        lastName: userPhr.lastName ?? "NA",
        age: parseInt(userPhr.age) ?? 0,
        email: userPhr.email || userDetails.email,
        // gender: userPhr.gender?.toLowerCase(),
        chronicCondition,
        vaccineRecords,
        diagnosedServices,
        medicalConditions,
        covidVaccines,
        fitnessRegime,
        prescription,
        allergies,
        belongsTo: {
          set: [createdUser.id],
        },
        additionalInformation,
      };

      const createdPhr = await strapi.service("api::phr.phr").updateOrCreatePhr(
        {
          belongsTo: createdUser.id,
        },
        phrData
      );
    }

    for (const vr of userDetails.emergency_contacts ?? []) {
      emergencyContacts.push({
        contactPersonName: vr.firstName + " " + vr.lastName ?? "NA",
        email: vr.email || userDetails.email,
        contactNumber: vr.phone ?? "NA",
        contactType: "Personal",
        country: "IN",
        relation: vr.relation,
        contactDegree: "1",
      });
    }
    for (const vr of userDetails.emergency_insurances ?? []) {
      UserInsurance.push({
        insuranceProvider: vr.insuranceProvider,
        policyNumber: vr.policyNo ?? "NA",
        contactPerson: vr.contactPerson ?? "NA",
        contactNumber: vr.contactNumber ?? "NA",
        // "expiryDate":vr.,
      });
    }
    const user_emergency_contacts_type_map = {
      Hospitals: "Hospital",
      Personal: "Personal",
      Doctor: "Doctor",
      Pharmacies: "Pharmacy",
    };
    for (const vr of userPhr.user_emergency_contacts ?? []) {
      emergencyContacts.push({
        contactPersonName:
          vr.user_contact_first_name + " " + vr.user_contact_last_name ?? " ",
        email: vr.user_contact_email?.split(",")?.shift() || userDetails.email,
        contactNumber: vr.user_contact_phone_no ?? "-",
        contactType:
          user_emergency_contacts_type_map[vr.contact_type ?? "Personal"],
        country: "IN",
        relation: vr.user_contact_relation,
        contactDegree: "1",
      });
    }

    for (const vr of userDetails.preferred_hospitals ?? []) {
      preferredServices.push({
        name: vr.hospital_name,
        contactPerson: vr.contactName ?? "NA",
        contactNumber: vr.contactNumber ?? "NA",
        preferredRank: vr.rank,
        ambulanceContact: vr.ambulanceContact,
        serviceType: vr.service_type,
        TypeOfSupport: vr.support_type,
      });
    }
    // for (const vr of userPhr.user_vaccine_records){}

    const userDetailData = {
      emergencyContacts,
      UserInsurance,
      preferredServices,
      user: {
        set: [createdUser.id],
      },
    };
    const userDetailsObject = await updateOrCreate(
      "api::user-detail.user-detail",
      {
        user: createdUser.id,
      },
      userDetailData
    );

    updateQuery = await userModel.updateOne(
      { email: user[0].email },
      { restoreStatus: 4 }
    );
    // if (updateQuery.restoreStatus) {
    //   console.log("update happened", updateQuery.restoreStatus);
    // }
    // console.log("update happened", updateQuery, { email: user[0].email });
    // updateQuery.save();
  },
});
