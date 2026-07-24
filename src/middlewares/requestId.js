import { randomUUID } from "crypto";

export const requestId = (req, res, next) => {
    const id = randomUUID();

    req.requestId = id;

    res.setHeader("X-Request-ID", id);

    next();
};