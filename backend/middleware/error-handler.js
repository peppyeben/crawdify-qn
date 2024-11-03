const { CustomAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = err;

    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }

    if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors)[0].message;
        customError = new CustomAPIError(errorMessage, 400);
    }

    res.status(customError.statusCode || 500).json({
        success: false,
        message: customError.message || "Something went wrong. Please try again.",
    });
};

module.exports = errorHandlerMiddleware;
