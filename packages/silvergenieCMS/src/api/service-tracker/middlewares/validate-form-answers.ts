import { Strapi } from "@strapi/strapi";
import { responseService } from "../../../utils";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const formAnswer = ctx.request.body.formAnswer as any[];
    if (!Array.isArray(formAnswer) || formAnswer.length === 0) {
      return new responseService(ctx, "Invalid formAnswer").BAD_REQUEST;
    }
    let isValidAnswer = true;
    let validationErrors = [];
    formAnswer.forEach((answer, index) => {
      if (!answer.questionId) {
        isValidAnswer = false;
        validationErrors.push("invalid id of form answer at index: " + index);
      }
      // if(!answer.itemCode)
      if (answer.hint && typeof answer.hint !== "string") {
        isValidAnswer = false;
        validationErrors.push("invalid hint of form answer at index: " + index);
      }
      if (!answer.question) {
        isValidAnswer = false;
        validationErrors.push(
          "invalid questionTitle of form answer at index: " + index
        );
      }
      if (!answer.type) {
        isValidAnswer = false;
        validationErrors.push("invalid type of form answer at index: " + index);
      }
      /// Possible to have non required fields that can have value as null
      // if (
      //   !answer.valueInteger &&
      //   !answer.valueDecimal &&
      //   !answer.valueBoolean &&
      //   !answer.valueDate &&
      //   !answer.valueDateTime &&
      //   !answer.valueTime &&
      //   !answer.valueReference &&
      //   !answer.valueChoice &&
      //   !answer.valueText
      // ) {
      //   isValidAnswer = false;
      //   validationErrors.push(
      //     "no value given of form answer at index: " + index
      //   );
      // }
      if (answer.valueReference && !Array.isArray(answer.valueReference)) {
        isValidAnswer = false;
        validationErrors.push(
          "invalid valueReference of form answer at index: " + index
        );
      } else if (
        answer.valueReference &&
        (answer.valueReference as any[]).length === 0
      ) {
        isValidAnswer = false;
        validationErrors.push(
          "invalid valueReference of form answer at index: " + index
        );
      } else if (answer.valueReference) {
        (answer.valueReference as any[]).map((values) => {
          if (typeof values != "string") {
            isValidAnswer = false;
            validationErrors.push(
              "invalid valueReference value of form answer at index: " + index
            );
          }
        });
      }

      if (answer.valueChoice && !Array.isArray(answer.valueChoice)) {
        isValidAnswer = false;
        validationErrors.push(
          "invalid valueChoice of form answer at index: " + index
        );
      } else if (
        answer.valueChoice &&
        (answer.valueChoice as any[]).length === 0
      ) {
        isValidAnswer = false;
        validationErrors.push(
          "invalid valueChoice of form answer at index: " + index
        );
      } else if (answer.valueChoice) {
        (answer.valueChoice as any[]).map((values) => {
          if (typeof values != "string") {
            isValidAnswer = false;
            validationErrors.push(
              "invalid valueChoice value of form answer at index: " + index
            );
          }
        });
      }
      /// Control type is only relevant for the UI
      // if (
      //   (answer.valueReference || answer.valueBoolean || answer.valueChoice) &&
      //   !answer.controlType
      // ) {
      //   isValidAnswer = false;
      //   validationErrors.push(
      //     "invalid controlType value of form answer at index: " + index
      //   );
      // }
    });

    if (isValidAnswer) {
      return await next();
    }
    return new responseService(
      ctx,
      `Invalid formAnswer, invalid keys: ${validationErrors.join(", ")}`
    ).BAD_REQUEST;
  };
};
