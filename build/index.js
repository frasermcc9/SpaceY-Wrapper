"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("./client/Client");
Object.defineProperty(exports, "createClient", {
    enumerable: true,
    get: function () {
        return Client_1.createClient;
    },
});
var Setup_1 = require("./settings/Setup");
Object.defineProperty(exports, "Setup", {
    enumerable: true,
    get: function () {
        return Setup_1.Setup;
    },
});
