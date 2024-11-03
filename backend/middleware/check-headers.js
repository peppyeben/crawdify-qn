require("dotenv").config();

const checkRequiredHeaders = (req, res, next) => {
    const requiredHeaderKey = process.env.REQUIRED_HEADER_KEY;
    const requiredHeaderValue = process.env.REQUIRED_HEADER_VALUE;

    const requestHeaderValue = req.header(requiredHeaderKey);

    if (!requestHeaderValue || requestHeaderValue !== requiredHeaderValue) {
        return res.status(400).json({
            success: false,
            message: `Missing or invalid ${requiredHeaderKey} header.`,
        });
    }

    next();
};

module.exports = checkRequiredHeaders;
