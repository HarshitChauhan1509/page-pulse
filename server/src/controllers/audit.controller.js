import { auditWebsite } from "../services/audit.service.js";

export async function audit(req, res, next) {
    try {
        const { url } = req.validatedData;

        const { cached, result } = await auditWebsite(url);

        return res.status(200).json({
            success: true,
            requestId: req.requestId,
            cached,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}