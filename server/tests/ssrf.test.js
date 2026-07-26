import { describe, expect, it } from "vitest";
import { isPrivateOrLocalHost } from "../src/utils/ssrf.js";

describe("SSRF protection", () => {
    it("blocks localhost hostnames", () => {
        expect(isPrivateOrLocalHost("localhost")).toBe(true);
        expect(isPrivateOrLocalHost("api.localhost")).toBe(true);
    });

    it("blocks private IPv4 ranges", () => {
        expect(isPrivateOrLocalHost("10.0.0.1")).toBe(true);
        expect(isPrivateOrLocalHost("172.16.0.1")).toBe(true);
        expect(isPrivateOrLocalHost("192.168.1.1")).toBe(true);
        expect(isPrivateOrLocalHost("169.254.1.1")).toBe(true);
        expect(isPrivateOrLocalHost("127.0.0.1")).toBe(true);
    });

    it("allows public hostnames and public IPs", () => {
        expect(isPrivateOrLocalHost("example.com")).toBe(false);
        expect(isPrivateOrLocalHost("8.8.8.8")).toBe(false);
    });
});
