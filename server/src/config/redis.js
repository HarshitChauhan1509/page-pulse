import dotenv from "dotenv";

dotenv.config();

class UpstashRedisClient {
    constructor(url, token) {
        this.url = url.replace(/\/+$/, "");
        this.token = token;
    }

    async request(command, ...args) {
        const response = await fetch(
            `${this.url}/${[command, ...args]
                .map((v) => encodeURIComponent(v))
                .join("/")}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        if (json.error) {
            throw new Error(json.error);
        }

        return json.result;
    }

    async get(key) {
        return this.request("get", key);
    }

    async set(key, value, ttl) {
        return this.request("set", key, value, "EX", ttl);
    }

    async del(key) {
        return this.request("del", key);
    }

    async ping() {
        return this.request("ping");
    }
}

let redis = null;

if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
) {
    redis = new UpstashRedisClient(
        process.env.UPSTASH_REDIS_REST_URL,
        process.env.UPSTASH_REDIS_REST_TOKEN
    );

    console.log("✅ Upstash REST Enabled");

} else {
    console.log("❌ Redis Disabled");
}

export default redis;