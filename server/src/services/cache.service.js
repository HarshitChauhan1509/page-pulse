import crypto from "crypto";
import redis from "../config/redis.js";

const TTL = Number(process.env.CACHE_TTL || 300);

function cacheKey(url) {
    return (
        "pagepulse:audit:" +
        crypto.createHash("sha256").update(url).digest("hex")
    );
}

export async function getCachedAudit(url) {
    if (!redis) {
        return null;
    }

    try {
        const data = await redis.get(cacheKey(url));

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    } catch (err) {
        console.error("Cache Read Error:", err);

        return null;
    }
}

export async function saveAudit(url, audit) {
    if (!redis) {
        return;
    }

    try {
        await redis.set(
            cacheKey(url),
            JSON.stringify(audit),
            TTL
        );
    } catch (err) {
        console.error("Cache Write Error:", err);
    }
}