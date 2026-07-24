export const audit = async (
    req,
    res,
    next
) => {
    try {
        res.json({
            success: true,

            requestId: req.requestId,

            data: req.validatedData,
        });
    } catch (err) {
        next(err);
    }
};