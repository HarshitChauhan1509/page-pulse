import pinoHttp from "pino-http";
import logger from "./logger.js";

const httpLogger = pinoHttp({
    logger,

    genReqId(req) {
        return req.requestId;
    },

    customSuccessMessage() {
        return "Request completed";
    },

    customErrorMessage() {
        return "Request failed";
    },
});

export default httpLogger;