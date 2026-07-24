import { z } from "zod";

export const auditSchema = z.object({
    url: z
        .string({
            required_error: "URL is required",
        })
        .url("Invalid URL")
        .refine(
            (url) => {
                const parsed = new URL(url);

                return (
                    parsed.protocol === "http:" ||
                    parsed.protocol === "https:"
                );
            },
            {
                message: "Only HTTP and HTTPS URLs are allowed",
            }
        ),
});