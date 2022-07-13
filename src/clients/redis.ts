// clients/redis.ts

import Redis from "ioredis";

import { makePromise } from "../utils/misc";
import { redisUrl } from "../env";

export let redis: Redis;

// connect to redis and return client when ready
export const connectRedis = async () => {
  const client = new Redis(redisUrl, {
    tls: {
      rejectUnauthorized: false,
    },
  });

  const [promise, resolve, reject] = makePromise();
  client.on("connect", () => resolve(client));
  client.on("error", reject);

  return promise;
};

export const redisPromise = connectRedis().then((client) => {
  redis = client;
});
