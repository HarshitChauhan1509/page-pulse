import logger from "../config/logger.js";

import { auditLimiter } from "../utils/concurrency.js";
import { fetchPage } from "../utils/fetchPage.js";
import { parseHtml } from "../utils/parseHtml.js";

import {
    getCachedAudit,
    saveAudit,
} from "./cache.service.js";

const inFlight = new Map();

export async function auditWebsite(url) {
    // Check Redis Cache
    const cachedAudit = await getCachedAudit(url);

    if (cachedAudit) {
        logger.info(
            {
                url,
                cached: true,
            },
            "Cache hit"
        );

        return {
            cached: true,
            result: cachedAudit,
        };
    }

    // Prevent duplicate concurrent fetches
    if (inFlight.has(url)) {
        logger.info(
            {
                url,
            },
            "Waiting for existing audit"
        );

        return inFlight.get(url);
    }

    const promise = auditLimiter(async () => {
        try {
            logger.info(
                {
                    url,
                },
                "Starting website audit"
            );

            const page = await fetchPage(url);

            const seo = parseHtml(page.html);

            const audit = {
                url,

                status: page.status,

                responseTime: page.responseTime,

                pageSize: Buffer.byteLength(
                    page.html,
                    "utf8"
                ),

                timestamp: new Date().toISOString(),

                ...seo,
            };

            await saveAudit(url, audit);

            logger.info(
                {
                    url,
                    cached: false,
                    status: page.status,
                    responseTime: page.responseTime,
                },
                "Audit completed successfully"
            );

            return {
                cached: false,
                result: audit,
            };
        } catch (error) {
            logger.error(
                {
                    url,
                    error: error.message,
                    stack: error.stack,
                },
                "Audit failed"
            );

            throw error;
        } finally {
            inFlight.delete(url);
        }
    });

    inFlight.set(url, promise);

    return promise;
}