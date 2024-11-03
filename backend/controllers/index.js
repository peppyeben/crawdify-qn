const { getData } = require("./get-data");
// const { modifyData } = require("./modify-data");
const { store } = require("./store");
const { webhookRequest } = require("./web/app");

module.exports = {
    store,
    getData,
    //  modifyData,
    webhookRequest
};
