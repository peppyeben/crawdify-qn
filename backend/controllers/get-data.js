const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors");
const Campaign = require("../model/initiative");

const getData = asyncWrapper(async (req, res) => {
    const { user_address, id } = req.query;

    let campaigns;

    if (user_address) {
        campaigns = await Campaign.find({
            user_address: user_address,
        }).limit(40);
    } else if (id) {
        campaigns = await Campaign.findById(id);
        if (campaigns) {
            campaigns = [campaigns];
        }
    } else {
        campaigns = await Campaign.find().limit(40);
    }

    res.status(200).json({
        success: true,
        campaigns: campaigns.length > 0 ? campaigns : [],
    });
});

module.exports = {
    getData,
};
