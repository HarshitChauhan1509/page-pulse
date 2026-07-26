import { rateLimit } from "express-rate-limit";

const windowMs =
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000;

const max = Number(process.env.RATE_LIMIT_MAX) || 100;

const limiter = rateLimit({

    windowMs,

    max,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        error: {

            code: "RATE_LIMIT",

            message:
                "Too many requests"

        }

    }

});

export default limiter;
