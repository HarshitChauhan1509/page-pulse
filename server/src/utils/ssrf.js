import dns from "dns/promises";
import net from "net";

function isPrivateIPv4(address) {
    const parts = address.split(".").map(Number);

    if (parts.length !== 4 || parts.some(Number.isNaN)) {
        return false;
    }

    const [first, second] = parts;

    return (
        first === 0 ||
        first === 10 ||
        first === 127 ||
        first === 169 && second === 254 ||
        first === 172 && second >= 16 && second <= 31 ||
        first === 192 && second === 168
    );
}

function isPrivateIPv6(address) {
    const normalized = address.toLowerCase();

    return (
        normalized === "::" ||
        normalized === "::1" ||
        normalized.startsWith("fc") ||
        normalized.startsWith("fd") ||
        normalized.startsWith("fe80:") ||
        normalized.startsWith("::ffff:127.") ||
        normalized.startsWith("::ffff:10.") ||
        normalized.startsWith("::ffff:192.168.")
    );
}

export function isPrivateOrLocalHost(hostname) {
    const normalized = hostname.toLowerCase();

    if (
        normalized === "localhost" ||
        normalized.endsWith(".localhost")
    ) {
        return true;
    }

    const ipVersion = net.isIP(normalized);

    if (ipVersion === 4) {
        return isPrivateIPv4(normalized);
    }

    if (ipVersion === 6) {
        return isPrivateIPv6(normalized);
    }

    return false;
}

export async function assertPublicHttpUrl(url) {
    const parsed = new URL(url);

    if (
        parsed.protocol !== "http:" &&
        parsed.protocol !== "https:"
    ) {
        const err = new Error(
            "Only HTTP and HTTPS URLs are allowed"
        );

        err.status = 400;
        err.code = "VALIDATION_ERROR";

        throw err;
    }

    if (isPrivateOrLocalHost(parsed.hostname)) {
        const err = new Error(
            "Localhost and private network addresses are not allowed"
        );

        err.status = 400;
        err.code = "SSRF_BLOCKED";

        throw err;
    }

    if (
        process.env.NODE_ENV !== "test" &&
        !net.isIP(parsed.hostname)
    ) {
        const records = await dns.lookup(parsed.hostname, {
            all: true,
        });

        if (
            records.some((record) =>
                isPrivateOrLocalHost(record.address)
            )
        ) {
            const err = new Error(
                "Target resolves to a private network address"
            );

            err.status = 400;
            err.code = "SSRF_BLOCKED";

            throw err;
        }
    }
}
