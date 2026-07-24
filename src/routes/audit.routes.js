import { Router } from "express";

import { validate } from "../middlewares/validate.js";

import { auditSchema } from "../validators/audit.validator.js";

import { audit } from "../controllers/audit.controller.js";

const router = Router();

router.post(
    "/",

    validate(auditSchema),

    audit
);

export default router;