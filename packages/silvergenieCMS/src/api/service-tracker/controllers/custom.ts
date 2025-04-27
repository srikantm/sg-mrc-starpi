import { responseService } from "../../../utils";
import { parse, format } from "date-fns";
export default {
  requestService: async (ctx) => {
    const me = ctx.state.user;

    const razorpay_api_key = process.env.RAZORPAY_KEY;

    if (!razorpay_api_key) {
      throw new Error("Server error! ");
    }
    const { formAnswer, productId }: { formAnswer: any[]; productId: string } =
      ctx.request.body;

    if (!productId || !formAnswer || formAnswer.length < 1) {
      return new responseService(ctx).BAD_REQUEST;
    }
    const product = await strapi.entityService.findOne(
      "api::product.product",
      productId,
      {
        populate: [
          "product_form.form.formDetails",
          "product_form.form.options",
          "product_form.form.validations",
        ],
      }
    );
    if (!product || !product.isActive || product.type !== "service") {
      return new responseService(ctx, "Invalid product").BAD_REQUEST;
    }

    const questions = product.product_form?.form;

    if (!questions || questions.length < 0) {
      return new responseService(ctx, "Invalid product").BAD_REQUEST;
    }

    if (questions.length !== formAnswer.length) {
      return new responseService(ctx, "Invalid request parameters").BAD_REQUEST;
    }
    const familyMemberQuestionId = questions.filter(
      (q) =>
        q.type === "reference" &&
        q.selectType === "single" &&
        q.controlType === "familyDropDown"
    )?.[0].id;
    if (!familyMemberQuestionId) {
      return new responseService(ctx, "Invalid product").BAD_REQUEST;
    }

    const answers = validateAndGetFormAnswers(formAnswer, questions);

    if (questions.length != answers.length) {
      return new responseService(ctx, "Invalid request parameters").BAD_REQUEST;
    }

    /// Taking the first member, keeping the schema open for list of member for the future scope
    const familyMemberServiceRequestedFor = answers
      .filter(
        (ans) =>
          ans.type === "reference" && ans.questionId === familyMemberQuestionId
      )?.[0]
      ?.valueReference?.split(",")?.[0];

    if (!familyMemberServiceRequestedFor) {
      return new responseService(ctx, "Invalid request parameters").BAD_REQUEST;
    }

    const member = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      familyMemberServiceRequestedFor,
      {
        populate: {
          address: true,
          family: { populate: { users: { fields: ["id"] } } },
        },
      }
    );

    const family = member.family;
    if (!family || !family.isActive) {
      return new responseService(
        ctx,
        "Invalid family member selected for service"
      ).BAD_REQUEST;
    }

    const familyMemberIds = family?.users?.map((u) => u.id) ?? [];

    if (familyMemberIds.length < 1 || !familyMemberIds.includes(me.id)) {
      return new responseService(ctx, "Invalid family access").BAD_REQUEST;
    }

    if (!member || member.blocked || !member.isFamilyMember) {
      return new responseService(
        ctx,
        "Invalid family member selected for service"
      ).BAD_REQUEST;
    }

    /// verify if the member belongs to same family as the authenticated user

    const pincode = member.address.postalCode;

    if (!pincode) {
      return new responseService(ctx, "No pincode found for the selected user")
        .BAD_REQUEST;
    }

    const daysDurationAnswer = answers.find(
      (ans) => ans.hint === "shiftDurationDays" && ans.type === "choice"
    );

    const shiftType = daysDurationAnswer?.valueChoice?.split(",")?.[0];

    const quantityAnswer = answers.filter(
      (ans) => ans.hint === "quantity" && ans.type === "integer"
    );
    const quantity = quantityAnswer?.[0]?.valueInteger;

    if (!quantity || !shiftType) {
      return new responseService(ctx, "Invalid request parameters").BAD_REQUEST;
    }

    const _shiftQuestion = questions.find(
      (q) =>
        q.type == daysDurationAnswer?.type &&
        q.id == daysDurationAnswer?.questionId
    );

    //@ts-ignore
    const _shiftOptions: any[] = (_shiftQuestion?.options as any) ?? [];

    const productShiftType = _shiftOptions.find(
      (o) => o.value == shiftType
    )?.display;

    const { amount, priceId } = await strapi
      .service("api::product.utils")
      .verifyProductRulesAndGetAmount(productId, {
        pincode: String(pincode),
        hours: shiftType,
      });

    if (amount === 0) {
      return new responseService(
        ctx,
        "Service not applicable for given pincode or days duration",
        "SERVICE_NOT_AVAILABLE_FOR_SELECTED_MEMBER"
      ).NOT_FOUND;
    }

    const finalAmount = Number(amount) * Number(quantity);
    const knex = strapi.db?.connection;

    const serviceTracker = await knex.transaction(async (trx) => {
      const metaData = [];
      answers
        .filter((a) => a.type !== "reference")
        .map((a) => {
          switch (a.type) {
            case "text":
              metaData.push({ key: a.question, value: a.valueText });
              break;
            case "string":
              metaData.push({ key: a.question, value: a.valueString });
              break;
            case "integer":
              metaData.push({
                key: a.question,
                value: a.valueInteger.toString(),
              });
              break;
            case "decimal":
              metaData.push({
                key: a.question,
                value: a.valueDecimal.toString(),
              });
              break;
            case "date":
              metaData.push({
                key: a.question,
                value: format(a.valueDate, "dd/MM/yyyy"),
              });
              break;
            case "choice":
              const _question = questions.find(
                (q) => q.type == "choice" && q.id == a.questionId
              );

              //@ts-ignore
              const options: any[] = (_question?.options as any) ?? [];

              const _valueDisplay = options.find(
                (o) => o.value == a.valueChoice
              )?.display;

              if (_valueDisplay) {
                metaData.push({ key: a.question, value: _valueDisplay });
              }

              break;

            default:
              break;
          }
        });

      const formAnswer = await strapi.entityService.create(
        "api::product-form-answer.product-form-answer",
        {
          data: {
            form: product.product_form?.id,
            answers: answers.map((a) => {
              return {
                ...a,
                questionId: a.questionId.toString(),
                valueDate: a.valueDate ? new Date(a.valueDate) : undefined,
              };
            }),
          },
          populate: { form: true },
          transacting: trx,
        }
      );

      const serviceTracker = await strapi.entityService.create(
        "api::service-tracker.service-tracker",
        {
          data: {
            product: product.id,
            status: "requested",
            priceId: priceId,
            paymentStatus: "due",
            service_form: product.product_form?.id,
            amount: finalAmount,
            priceDetails: {
              products: [
                {
                  priceId: priceId.toString(),
                  productId: product.id.toString(),
                  productName: product.name,
                  displayName:
                    productShiftType == null
                      ? product.name
                      : `${product.name} ${productShiftType}`,
                  price: Number(amount),
                  quantity: Number(quantity),
                },
              ],
              totalAmount: finalAmount,
              subTotal: finalAmount,
              totalDiscount: 0,
              totalTax: 0,
            },
            requestedFor: [member.id],
            requestedAt: new Date(),
            requestedBy: me.id,
            family: family.id,
            metadata: metaData,
            form_answer: formAnswer.id,
            serviceFormAnwserJSON: JSON.parse(JSON.stringify(answers)),
          },
          //@ts-ignore
          transacting: trx,
          populate: {
            metadata: true,
            priceDetails: {
              populate: { products: true, taxes: true, discounts: true },
            },
          },
        }
      );

      return serviceTracker;
    });

    const order = await strapi.service("api::utils.utils").createRazorpayOrder({
      amount: finalAmount,
      receipt: `service#${serviceTracker.id}`,
      notes: {
        serviceTrackerId: serviceTracker.id,
      },
    });

    if (!order) {
      throw new Error("Could not create order!");
    }

    return new responseService(ctx, "Service request accepeted", "SUCCESS").OK({
      id: serviceTracker.id,
      razorpay_api_key,
      order_id: order.id,
      amount: finalAmount,
      memberName: [member.firstName, member.lastName ?? ""].join(" "),
      //@ts-ignore
      metaData: serviceTracker.metadata,
      //@ts-ignore
      priceDetails: serviceTracker.priceDetails,
    });
  },

  me: async (ctx) => {
    const authUser = ctx.state.user;
    const results = await strapi.entityService.findMany(
      "api::service-tracker.service-tracker",
      {
        filters: {
          paymentStatus: { $ne: "expired" },
          requestedBy: {
            id: {
              $eq: authUser.id,
            },
          },
        },
        limit: 100,
        sort: "requestedAt:desc",
        populate: {
          metadata: true,
          product: {
            fields: ["category", "name", "type"],
          },
          requestedFor: {
            fields: ["firstName", "lastName", "gender", "relation"],
            populate: { profileImg: true },
          },
          priceDetails: {
            populate: { products: true, taxes: true, discounts: true },
          },
        },
      }
    );
    return { services: results };
  },
};

const formTypes = [
  "integer",
  "decimal",
  "reference",
  "choice",
  "date",
  "time",
  "dateTime",
  "boolean",
  "text",
  "string",
] as const;

type FormType = (typeof formTypes)[number];

type FormAnswer = {
  questionId: string;
  type: FormType;
  question: string;
  hint?: string;
  valueInteger?: number;
  valueString?: string;
  valueText?: string;
  valueDecimal?: number;
  valueBoolean?: boolean;
  valueDate?: Date;
  valueChoice?: string;
  valueReference?: string;
};

function isFormType(value: any): value is FormType {
  return formTypes.includes(value);
}

function isList(value: any): value is any[] {
  return Array.isArray(value);
}

function ensureString(value: any): string {
  if (typeof value === "string") {
    return value;
  } else {
    return String(value);
  }
}

const validateAndGetFormAnswers = (formAnswer: any[], questions: any[]) => {
  return formAnswer
    .map((f) => {
      if (!f.question || !f.questionId || !isFormType(f.type)) {
        return;
      }
      const type: FormType = f.type;

      const question = questions.filter(
        (q) => q.type === type && q.id == f.questionId
      )?.[0];
      if (!question) {
        return null;
      }
      let answer: FormAnswer = {
        question: f.question,
        questionId: f.questionId,
        type,
        hint: f.hint,
      };
      switch (type) {
        case "text":
          if (
            question.formDetails.required &&
            (!f.valueText ||
              typeof f.valueText != "string" ||
              f.valueText?.length < 1)
          ) {
            answer = null;
            break;
          }

          /// Very detailed validations to be added

          answer = { ...answer, valueText: f.valueText };
          break;
        case "string":
          if (
            question.formDetails.required &&
            (!f.valueString ||
              typeof f.valueString != "string" ||
              f.valueString?.length < 1)
          ) {
            answer = null;
            break;
          }
          answer = { ...answer, valueString: f.valueString };
          break;
        case "integer":
          if (
            question.formDetails.required &&
            !f.valueInteger &&
            typeof f.valueInteger != "number"
          ) {
            answer = null;
            break;
          }
          answer = { ...answer, valueInteger: f.valueInteger };
          break;
        case "decimal":
          if (
            question.formDetails.required &&
            !f.valueDecimal &&
            typeof f.valueDecimal != "number"
          ) {
            answer = null;
            break;
          }
          answer = { ...answer, valueDecimal: f.valueDecimal };
          break;
        case "date":
          if (question.formDetails.required && !f.valueDate) {
            answer = null;
            break;
          }
          question.dateFormat;
          answer = {
            ...answer,
            valueDate: parse(
              f.valueDate,
              question.dateFormat ?? "dd/MM/yyyy",
              new Date()
            ),
          };
          break;
        case "boolean":
          if (question.formDetails.required && !f.valueBoolean) {
            answer = null;
            break;
          }
          answer = { ...answer, valueBoolean: f.valueBoolean };
          break;
        case "reference":
          if (
            question.formDetails.required &&
            !f.valueReference &&
            isList(f.valueReference) &&
            f.valueReference.length < 1
          ) {
            answer = null;
            break;
          }
          answer = {
            ...answer,
            valueReference: f.valueReference
              .map((c) => ensureString(c))
              .join(","),
          };
          break;

        case "choice":
          if (
            question.formDetails.required &&
            !f.valueChoice &&
            isList(f.valueChoice) &&
            f.valueChoice.length < 1
          ) {
            answer = null;
            break;
          }
          //@ts-ignore
          const options: any[] = (question?.options as any) ?? [];
          const optionValues = new Set(options.map((option) => option?.value));

          if (!f.valueChoice.every((choice) => optionValues.has(choice))) {
            answer = null;
            break;
          }
          answer = {
            ...answer,
            valueChoice: f.valueChoice.map((c) => ensureString(c)).join(","),
          };
          break;

        default:
          answer = null;
          break;
      }

      return answer;
    })
    .filter((a) => a != null);
};
