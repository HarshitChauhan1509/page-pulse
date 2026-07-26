import { describe, it, expect, beforeEach, vi } from "vitest";

// ------------------------------
// Mock Redis
// ------------------------------

const { getMock, setExMock, connectRedisMock } = vi.hoisted(() => ({
    getMock: vi.fn(),
    setExMock: vi.fn(),
    connectRedisMock: vi.fn(),
}));

vi.mock("../src/config/redis.js", () => ({
    default: {
        get: getMock,
        setEx: setExMock,
    },
    connectRedis: connectRedisMock,
}));

import {
    getCachedAudit,
    saveAudit,
} from "../src/services/cache.service.js";

describe("Cache Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getCachedAudit()", () => {
        it("should return cached object", async () => {
            const cachedData = {
                title: "OpenAI",
                status: 200,
            };

            getMock.mockResolvedValue(
                JSON.stringify(cachedData)
            );

            const result = await getCachedAudit(
                "https://openai.com"
            );

            expect(result).toEqual(cachedData);

            expect(getMock).toHaveBeenCalledTimes(1);
        });

        it("should return null when cache is empty", async () => {
            getMock.mockResolvedValue(null);

            const result = await getCachedAudit(
                "https://openai.com"
            );

            expect(result).toBeNull();

            expect(getMock).toHaveBeenCalledTimes(1);
        });

        it("should throw if redis fails", async () => {
            getMock.mockRejectedValue(
                new Error("Redis Error")
            );

            await expect(
                getCachedAudit("https://openai.com")
            ).rejects.toThrow("Redis Error");
        });
    });

    describe("saveAudit()", () => {
        it("should save audit into redis", async () => {
            setExMock.mockResolvedValue("OK");

            const audit = {
                title: "OpenAI",
                status: 200,
            };

            await saveAudit(
                "https://openai.com",
                audit
            );

            expect(setExMock).toHaveBeenCalledTimes(1);

            const args = setExMock.mock.calls[0];

            expect(args[0]).toContain("audit:");

            expect(args[2]).toBe(
                JSON.stringify(audit)
            );
        });

        it("should throw when redis save fails", async () => {
            setExMock.mockRejectedValue(
                new Error("Redis Write Error")
            );

            await expect(
                saveAudit(
                    "https://openai.com",
                    {
                        title: "OpenAI",
                    }
                )
            ).rejects.toThrow(
                "Redis Write Error"
            );
        });
    });
});
