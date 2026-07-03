export const catchAsync = (fn, { successStatus = 200, errorStatus = 500, successMessage } = {}) => {
    return async (req, res) => {
        try {
            const result = await fn(req, res);
            if (res.headersSent) return;

            const response = { success: true };
            if (successMessage) response.message = successMessage;
            if (result !== undefined) response.data = result;
            if (Array.isArray(result)) response.count = result.length;

            return res.status(successStatus).json(response);
        } catch (error) {
            if (res.headersSent) return;
            return res.status(errorStatus).json({
                success: false,
                message: error.message
            });
        }
    };
};
