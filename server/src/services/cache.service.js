import crypto from "crypto";
import redis, { connectRedis } from "../config/redis.js";

const ttl = Number(process.env.CACHE_TTL) || 300;
const memoryCache = new Map();

function useMemoryCache() {
    return (
        process.env.NODE_ENV === "test" &&
        !redis.get?._isMockFunction
    );
}

function generateCacheKey(url) {
    return (
        "audit:" +
        crypto.createHash("sha256").update(url).digest("hex")
    );
}

export async function getCachedAudit(url) {
    const key = generateCacheKey(url);

    if (useMemoryCache()) {
        const entry = memoryCache.get(key);

        if (!entry || entry.expiresAt <= Date.now()) {
            memoryCache.delete(key);
            return null;
        }

        return entry.value;
    }

    await connectRedis();

    const cached = await redis.get(key);

    if (!cached) {
        return null;
    }

    return JSON.parse(cached);
}

export async function saveAudit(url, data) {
    const key = generateCacheKey(url);

    if (useMemoryCache()) {
        memoryCache.set(key, {
            value: data,
            expiresAt: Date.now() + ttl * 1000,
        });

        return;
    }

    await connectRedis();

    await redis.setEx(
        key,
        ttl,
        JSON.stringify(data)
    );
}
