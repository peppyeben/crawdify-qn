const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors");
const { getDB } = require("../db/index");

const modifyData = asyncWrapper(async (req, res) => {
    const { data, collection_name, doc_id } = req.body;

    console.log(data);
    console.log(collection_name);
    console.log(doc_id);

    const newData = {};

    if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
        throw new CustomAPIError("data must be a non-empty object.", 400);
    }

    if (typeof doc_id != "string" || doc_id.trim() == "")
        throw new CustomAPIError("doc_id must be a non-empty string", 400);

    if (typeof data.name == "string" && data.name.trim() != "") newData.name = data.name;

    if (typeof data.description == "string" && data.description.trim() != "")
        newData.description = data.description;

    if (typeof data.campaignAddress == "string" && data.campaignAddress.trim() != "")
        newData.campaignAddress = data.campaignAddress;

    if (typeof data.imageUrl == "string" && data.imageUrl.trim() != "") newData.imageUrl = data.imageUrl;

    if (typeof collection_name !== "string" || collection_name.trim() === "") {
        throw new CustomAPIError("collection_name must be a non-empty string.", 400);
    }

    const db = await getDB();

    const tx = await db.update(data, collection_name, doc_id);

    if (tx.success == true) {
        res.status(200).json({
            success: true,
        });
    } else {
        throw new CustomAPIError(`${tx.error}`, 400);
    }
});

module.exports = {
    modifyData,
};
