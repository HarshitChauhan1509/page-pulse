import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Health Endpoint", () => {
    it("should return healthy status", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.status).toBe("healthy");

        expect(response.body).toHaveProperty("uptime");

        expect(response.body).toHaveProperty("timestamp");

        expect(response.body).toHaveProperty("memory");
    });

    it("should respond with JSON", async () => {
        const response = await request(app).get("/health");

        expect(response.headers["content-type"]).toContain(
            "application/json"
        );
    });

    it("should always be available", async () => {
        const response = await request(app).get("/health");

        expect(response.status).not.toBe(500);
    });
});