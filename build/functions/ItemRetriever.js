"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveItem = void 0;
const httpRequest_1 = require("./httpRequest");
function retrieveItem(itemName) {
    return httpRequest_1.httpRequest("item/" + itemName);
}
exports.retrieveItem = retrieveItem;
//# sourceMappingURL=ItemRetriever.js.map