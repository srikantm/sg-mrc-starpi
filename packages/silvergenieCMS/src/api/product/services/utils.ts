import { Entity } from "@strapi/strapi";

export default () => ({
  async verifyProductRulesAndGetAmount(
    productId: string,
    { pincode, hours }: { pincode: string; hours: string }
  ) {
    const product = await strapi.entityService.findOne(
      "api::product.product",
      productId,
      {
        populate: {
          prices: {
            populate: ["rules"],
          },
        },
      }
    );

    if ((product.prices?.length ?? 0) < 1) {
      return { amount: 0, priceId: null };
    }

    let hitAmount = 0;
    let priceId: Entity.ID;
    let matchFound = false;

    for (let i = 0; i < product.prices.length; i++) {
      if (matchFound) {
        continue;
      }
      let price = product.prices[i];

      let currMatchHits = 0; // Reset current match hits for each price

      if ((price.rules.length ?? 0) === 0) {
        hitAmount = price.unitAmount;
        priceId = price.id;
        matchFound = true;
        continue;
      }

      price.rules.forEach((rule) => {
        if (rule.ruleType === "pincodeEquals" && rule.value === pincode) {
          currMatchHits++;
        }
        if (
          rule.ruleType === "pincodeRange" &&
          isPincodeInRange(rule.value, Number(pincode))
        ) {
          currMatchHits++;
        }
        if (rule.ruleType === "hoursEq" && rule.value === hours) {
          currMatchHits++;
        }
        if (rule.ruleType === "default") {
          currMatchHits++;
        }

        if (currMatchHits === (price.rules?.length ?? 0)) {
          hitAmount = price.unitAmount;
          priceId = price.id;
          matchFound = true;
        }
      });
    }

    return { amount: hitAmount, priceId };
  },
});

function isPincodeInRange(pincodeRange: string, valuePincode: number) {
  const [startPincode, endPincode] = pincodeRange
    .split(",")
    .map((pincode) => parseInt(pincode.trim()));
  return valuePincode >= startPincode && valuePincode <= endPincode;
}
