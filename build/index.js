"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("./client/Client");
Object.defineProperty(exports, "SpaceClient", { enumerable: true, get: function () { return Client_1.SpaceClient; } });
var Setup_1 = require("./settings/Setup");
Object.defineProperty(exports, "Setup", { enumerable: true, get: function () { return Setup_1.Setup; } });
exports.constants = __importStar(require("./structures/Constants"));
var ItemRetriever_1 = require("./functions/ItemRetriever");
Object.defineProperty(exports, "retrieveItem", { enumerable: true, get: function () { return ItemRetriever_1.retrieveItem; } });
//# sourceMappingURL=index.js.map