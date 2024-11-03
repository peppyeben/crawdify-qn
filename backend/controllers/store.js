const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors");
const Campaign = require("../model/initiative");
const BigNumber = require("bignumber.js");

const store = asyncWrapper(async (req, res) => {
    const { data } = req.body;

    if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
        throw new CustomAPIError("data must be a non-empty object.", 400);
    }

    console.log(data);
    let { title, description, goal, end_date, user_address } = data;

    let campaign = new Campaign({
        title,
        description,
        goal: new BigNumber(goal).multipliedBy(new BigNumber("1000000")),
        end_date: new Date(end_date),
        user_address,
    });

    await campaign.validate();

    campaign = await campaign.save();

    res.status(201).json({
        success: true,
        result: campaign._id,
    });
});

module.exports = {
    store,
};
