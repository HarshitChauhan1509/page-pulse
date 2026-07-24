export const errorHandler = (
    err,
    req,
    res,
    next
) => {
    console.error(err);

    return res.status(err.status || 500).json({
        success: false,

        requestId: req.requestId,

        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",

            message:
                err.message ||
                "Something went wrong",
        },
    });
};