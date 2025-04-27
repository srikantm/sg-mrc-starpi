// const redis = require("redis");
import { createClient } from "redis";
import Razorpay from "razorpay";
import { IMap } from "razorpay/dist/types/api";
// import {type RazorpaySubscription} from "razorpay/dist/types/subscriptions"
// redisClient.on("connect", function () {
//   console.log("Redis client connected", 2);
// });

// redisClient.on("error", function (err) {
//   console.log("Something went wrong " + err, 0);
// });

const getRedisClient = async () => {
  const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    socket: {
      connectTimeout: 5000, // Set connection timeout to 5 seconds
    },
  });
  // process.env.REDIS_PORT,
  // process.env.REDIS_HOST
  await redisClient.connect();
  return redisClient;
};

const getRazorpay = async () => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY, // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Key Secret
  });

  return razorpay;
};

export default () => ({
  redisSet: async (_key, _value, _options) => {
    const redisClient = await getRedisClient();
    let output;
    try {
      output = await redisClient.set(_key, JSON.stringify(_value), _options);
    } catch (error) {
      console.log(error);
    }
    await redisClient.quit();
    return output;
  },
  redisGet: async (_key, _options) => {
    const redisClient = await getRedisClient();
    let output;
    try {
      output = await redisClient.get(_key, _options);
    } catch (error) {
      console.log(error);
    }
    await redisClient.quit();
    console.log(output);
    return JSON.parse(output);
  },
  createRazorpayPlan: async (_value) => {
    const razorpay = await getRazorpay();

    const razorpayPlan = await razorpay.plans.create({
      period: _value.period,
      interval: _value.interval,
      item: {
        name: _value.name,
        amount: _value.price,
        currency: "INR",
        description: _value.description,
      },
    });
    return razorpayPlan;
  },

  createRazorpayOrder: async (order: {
    amount: number;
    receipt: string;
    notes: IMap<string | number>;
  }) => {
    const razorpay = await getRazorpay();

    const razorpayOrder = await razorpay.orders.create({
      amount: order.amount * 100,
      receipt: order.receipt,
      currency: "INR",
      notes: order.notes,
    });
    return razorpayOrder;
  },
  getRazorpayPlan: async (_value) => {
    const razorpay = await getRazorpay();

    const razorpayPlan = await razorpay.plans.fetch(_value.planId);
    return razorpayPlan;
  },
  createRazorpaySubscription: async (_value) => {
    const razorpay = await getRazorpay();

    const razorpaySubscriptions = await razorpay.subscriptions.create({
      plan_id: _value.planId,
      customer_notify: 1,
      quantity: _value.quantity || 1,
      total_count: _value.total_count || 100,
    });
    return razorpaySubscriptions;
  },
  getRazorpaySubscription: async (_value) => {
    const razorpay = await getRazorpay();

    const razorpayPlan = await razorpay.subscriptions.fetch(
      _value.subscriptionId
    );
    return razorpayPlan;
  },
  getRazorpayPayment: async (_value) => {
    const razorpay = await getRazorpay();

    const razorpayPlan = await razorpay.payments.fetch(_value.paymentId);
    return razorpayPlan;
  },
});
