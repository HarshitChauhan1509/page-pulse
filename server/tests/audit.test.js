import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

import axios from "axios";
import app from "../src/app.js";

vi.mock("axios");

describe("Audit API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should audit a website successfully", async () => {

        axios.get.mockResolvedValue({
            status: 200,

            headers: {
                "content-type": "text/html"
            },

            data: `
        <!DOCTYPE html>
        <html>

          <head>

            <title>OpenAI</title>

            <meta
              name="description"
              content="Artificial Intelligence">

          </head>

          <body>

            <h1>Welcome</h1>

            <img src="1.jpg">

            <img src="2.jpg">

            <a href="/">Home</a>

            <a href="/about">About</a>

          </body>

        </html>
      `
        });

        const response = await request(app)

            .post("/api/v1/audit")

            .send({

                url: "https://openai.com"

            });

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body).toHaveProperty("requestId");

        expect(response.body.data.title).toBe("OpenAI");

        expect(response.body.data.description)
            .toBe("Artificial Intelligence");

        expect(response.body.data.h1)
            .toBe("Welcome");

        expect(response.body.data.images)
            .toBe(2);

        expect(response.body.data.links)
            .toBe(2);

        expect(response.body.data.status)
            .toBe(200);

    });

    it("should return request id", async () => {

        axios.get.mockResolvedValue({

            status: 200,

            headers: {},

            data: "<html></html>"

        });

        const response = await request(app)

            .post("/api/v1/audit")

            .send({

                url: "https://example.com"

            });

        expect(response.body.requestId)

            .toBeDefined();

    });

    it("should return cached property", async () => {

        axios.get.mockResolvedValue({

            status: 200,

            headers: {},

            data: "<html></html>"

        });

        const response = await request(app)

            .post("/api/v1/audit")

            .send({

                url: "https://example.com"

            });

        expect(response.body)

            .toHaveProperty("cached");

    });

    it("should handle timeout", async () => {

        axios.get.mockRejectedValue({

            code: "ECONNABORTED"

        });

        const response = await request(app)

            .post("/api/v1/audit")

            .send({

                url: "https://timeout.com"

            });

        expect(response.status)

            .toBe(504);

        expect(response.body.success)

            .toBe(false);

    });

    it("should handle fetch failure", async () => {

        axios.get.mockRejectedValue(

            new Error("Network Error")

        );

        const response = await request(app)

            .post("/api/v1/audit")

            .send({

                url: "https://abc.com"

            });

        expect(response.status)

            .toBe(502);

        expect(response.body.success)

            .toBe(false);

    });

    it("should reject invalid payload", async () => {

        const response = await request(app)

            .post("/api/v1/audit")

            .send({

                url: "abc"

            });

        expect(response.status)

            .toBe(400);

    });

});