import { describe, it, expect, beforeEach, vi } from "vitest";

// ------------------------------
// Mock Dependencies
// ------------------------------

vi.mock("../src/services/cache.service.js", () => ({
    getCachedAudit: vi.fn(),
    saveAudit: vi.fn(),
}));

vi.mock("../src/utils/fetchPage.js", () => ({
    fetchPage: vi.fn(),
}));

vi.mock("../src/utils/parseHtml.js", () => ({
    parseHtml: vi.fn(),
}));

vi.mock("../src/config/logger.js", () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../src/utils/concurrency.js", () => ({
    auditLimiter: async (fn) => fn(),
}));

import { auditWebsite } from "../src/services/audit.service.js";

import {
    getCachedAudit,
    saveAudit,
} from "../src/services/cache.service.js";

import { fetchPage } from "../src/utils/fetchPage.js";

import { parseHtml } from "../src/utils/parseHtml.js";

describe("Audit Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return cached audit if present", async () => {
        const cachedAudit = {
            title: "Cached Title",
            status: 200,
        };

        getCachedAudit.mockResolvedValue(cachedAudit);

        const result = await auditWebsite(
            "https://openai.com"
        );

        expect(getCachedAudit).toHaveBeenCalledOnce();

        expect(fetchPage).not.toHaveBeenCalled();

        expect(result.cached).toBe(true);

        expect(result.result).toEqual(cachedAudit);
    });

    it("should fetch page when cache is empty", async () => {
        getCachedAudit.mockResolvedValue(null);

        fetchPage.mockResolvedValue({
            status: 200,
            responseTime: 120,
            html: "<html></html>",
        });

        parseHtml.mockReturnValue({
            title: "OpenAI",
            description: "AI",
            h1: "Welcome",
            images: 2,
            links: 4,
        });

        const result = await auditWebsite(
            "https://openai.com"
        );

        expect(fetchPage).toHaveBeenCalledOnce();

        expect(parseHtml).toHaveBeenCalledOnce();

        expect(saveAudit).toHaveBeenCalledOnce();

        expect(result.cached).toBe(false);

        expect(result.result.title).toBe("OpenAI");

        expect(result.result.status).toBe(200);

        expect(result.result.images).toBe(2);

        expect(result.result.links).toBe(4);
    });

    it("should save audit into cache", async () => {
        getCachedAudit.mockResolvedValue(null);

        fetchPage.mockResolvedValue({
            status: 200,
            responseTime: 80,
            html: "<html></html>",
        });

        parseHtml.mockReturnValue({
            title: "Example",
            description: "",
            h1: "",
            images: 0,
            links: 0,
        });

        await auditWebsite("https://example.com");

        expect(saveAudit).toHaveBeenCalledOnce();
    });

    it("should throw timeout error", async () => {
        getCachedAudit.mockResolvedValue(null);

        fetchPage.mockRejectedValue(
            new Error("Remote server exceeded timeout")
        );

        await expect(
            auditWebsite("https://slow.com")
        ).rejects.toThrow(
            "Remote server exceeded timeout"
        );
    });

    it("should throw fetch error", async () => {
        getCachedAudit.mockResolvedValue(null);

        fetchPage.mockRejectedValue(
            new Error("Unable to fetch target URL")
        );

        await expect(
            auditWebsite("https://broken.com")
        ).rejects.toThrow(
            "Unable to fetch target URL"
        );
    });

    it("should calculate page size", async () => {
        getCachedAudit.mockResolvedValue(null);

        fetchPage.mockResolvedValue({
            status: 200,
            responseTime: 50,
            html: "<html><body>Hello</body></html>",
        });

        parseHtml.mockReturnValue({
            title: "",
            description: "",
            h1: "",
            images: 0,
            links: 0,
        });

        const result = await auditWebsite(
            "https://test.com"
        );

        expect(result.result.pageSize).toBeGreaterThan(0);
    });

    it("should include timestamp", async () => {
        getCachedAudit.mockResolvedValue(null);

        fetchPage.mockResolvedValue({
            status: 200,
            responseTime: 50,
            html: "<html></html>",
        });

        parseHtml.mockReturnValue({
            title: "",
            description: "",
            h1: "",
            images: 0,
            links: 0,
        });

        const result = await auditWebsite(
            "https://test.com"
        );

        expect(result.result.timestamp).toBeDefined();

        expect(typeof result.result.timestamp).toBe(
            "string"
        );
    });
});