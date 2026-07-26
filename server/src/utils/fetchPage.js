import axios from "axios";
import { assertPublicHttpUrl } from "./ssrf.js";

export async function fetchPage(url) {
    const timeout =
        Number(process.env.REQUEST_TIMEOUT) || 5000;

    const start = Date.now();
    let nextUrl = url;

    try {
        for (let redirectCount = 0; redirectCount <= 5; redirectCount++) {
            await assertPublicHttpUrl(nextUrl);

            const response = await axios.get(nextUrl, {
                timeout,
                maxRedirects: 0,
                headers: {
                    "User-Agent":
                        "PagePulseBot/1.0 (+https://digitalheroesco.com)"
                },
                validateStatus: () => true
            });

            if (
                response.status >= 300 &&
                response.status < 400 &&
                response.headers.location
            ) {
                nextUrl = new URL(
                    response.headers.location,
                    nextUrl
                ).toString();

                continue;
            }

            const responseTime = Date.now() - start;

            return {
                html: response.data,
                status: response.status,
                responseTime,
                headers: response.headers
            };
        }

        const err = new Error("Too many redirects");

        err.status = 508;
        err.code = "TOO_MANY_REDIRECTS";

        throw err;
    } catch (error) {
        if (error.status && error.code) {
            throw error;
        }

        if (error.code === "ECONNABORTED") {

            const err = new Error(
                "Remote server exceeded timeout"
            );

            err.status = 504;
            err.code = "TIMEOUT";

            throw err;

        }

        const err = new Error(
            "Unable to fetch target URL"
        );

        err.status = 502;
        err.code = "FETCH_FAILED";

        throw err;
    }
}
