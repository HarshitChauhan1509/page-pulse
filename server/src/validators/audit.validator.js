import { z } from "zod";
import { isPrivateOrLocalHost } from "../utils/ssrf.js";

function parseUrl(value) {
    try {
        return new URL(value);
    } catch {
        return null;
    }
}

export const auditSchema = z.object({
    url: z
        .string({
            required_error: "URL is required",
        })
        .trim()
        .url("Invalid URL")
        .refine((url) => {
            const parsed = parseUrl(url);

            return parsed && (
                parsed.protocol === "http:" ||
                parsed.protocol === "https:"
            );
        }, {
            message: "Only HTTP and HTTPS URLs are allowed",
        })
        .refine((url) => {
            const parsed = parseUrl(url);

            return (
                parsed &&
                !isPrivateOrLocalHost(parsed.hostname)
            );
        }, {
            message:
                "Localhost and private network addresses are not allowed",
        }),
});
