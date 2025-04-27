import { Schema } from "mongoose";

export const OldUserSchema = new Schema({
  confirmed: Boolean,
  blocked: Boolean,
  gender: String,
  title: { type: "Mixed" },
  enableFitbit: Boolean,
  downloadEmergency: Boolean,
  emergency_form_consent: Boolean,
  profile_image: { type: "Mixed" },
  bookmarked_doctors: { type: "Mixed" },
  phone_no: String,
  last_name: String,
  username: String,
  country_code: String,
  first_name: String,
  email: String,
  provider: String,
  createdAt: String,
  updatedAt: String,
  phr: { type: "Mixed" },
  plan_purchase: String,
  appointments: { type: "Mixed" },
  members: { type: "Mixed" },
  plan_purchases: { type: "Mixed" },
  subscriptions: { type: "Mixed" },
  fitbits: { type: "Mixed" },
  advisories: { type: "Mixed" },
  emergency_contacts: { type: "Mixed" },
  emergency_insurances: { type: "Mixed" },
  preferred_hospitals: { type: "Mixed" },
  marketplace_orders: { type: "Mixed" },
  id: String,
  restoreStatus: Number,
});

export const getOldUserModel = async ({ strapi }) => {
  const mongoClient = await strapi
    .service("api::mongo-db.mongodb")
    .getConnection();
  const UserRestore = mongoClient.model("UserRestore", OldUserSchema);
  return UserRestore;
};
