export const validate =
    (schema) =>
        (req, res, next) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid request body",
                        details: result.error.flatten(),
                    },
                });
            }

            req.validatedData = result.data;

            next();
        };