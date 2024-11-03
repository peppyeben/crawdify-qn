const express = require("express");
const {
    store,
    getData,
    webhookRequest,
    // modifyData,
} = require("../controllers");
const { checkRequiredHeaders } = require("../middleware/index");
const router = express.Router();

router
    .route("/store")
    .get(checkRequiredHeaders, getData)
    .post(checkRequiredHeaders, store);
// .patch(modifyData);
router.route("/webhook").post(webhookRequest);

module.exports = router;
