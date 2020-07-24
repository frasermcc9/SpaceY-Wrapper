"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = void 0;
const http_1 = require("http");
const __1 = require("..");
function httpRequest(path) {
    return new Promise((resolve) => {
        let data = "";
        http_1.get(__1.Setup.restUrl + __1.Setup.restPort + "/" + path, (res) => {
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                resolve(JSON.parse(data));
            });
        });
    });
}
exports.httpRequest = httpRequest;
//# sourceMappingURL=httpRequest.js.map