import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Audit Validation", () => {
    const endpoint = "/api/v1/audit";

    it("should reject missing url", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({});

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject empty string", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "",
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
    });

    it("should reject invalid url", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "abcdef",
            });

        expect(response.status).toBe(400);
    });

    it("should reject ftp protocol", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "ftp://example.com",
            });

        expect(response.status).toBe(400);

        expect(response.body.error.message).toBe(
            "Invalid request body"
        );
    });

    it("should reject localhost", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "http://localhost:3000",
            });

        expect(response.status).toBe(400);
    });

    it("should reject localhost ip", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "http://127.0.0.1",
            });

        expect(response.status).toBe(400);
    });

    it("should reject private ip 10.x.x.x", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "http://10.0.0.10",
            });

        expect(response.status).toBe(400);
    });

    it("should reject private ip 192.168.x.x", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "http://192.168.1.1",
            });

        expect(response.status).toBe(400);
    });

    it("should reject private ip 172.16.x.x", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "http://172.16.0.10",
            });

        expect(response.status).toBe(400);
    });

    it("should reject number instead of string", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: 12345,
            });

        expect(response.status).toBe(400);
    });

    it("should accept valid https url", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "https://openai.com",
            });

        // Validation passed.
        // It may return 200, 502 or 504 depending on fetch result.
        expect([200, 502, 504]).toContain(response.status);
    });

    it("should accept valid http url", async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                url: "http://example.com",
            });

        expect([200, 502, 504]).toContain(response.status);
    });
});