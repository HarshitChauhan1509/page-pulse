import pLimit from "p-limit";

const maxConcurrency =
    Number(process.env.MAX_CONCURRENT_REQUESTS) || 10;

export const auditLimiter = pLimit(maxConcurrency);