"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
class Setup {
    static changeSocketPort(port) {
        Setup.socketPort = port;
    }
    static changeRestPort(port) {
        Setup.restPort = port;
    }
    static changeSocketUrl(url) {
        Setup.socketUrl = url;
    }
    static changeRestUrl(url) {
        Setup.restUrl = url;
    }
}
exports.Setup = Setup;
Setup.socketPort = 8000;
Setup.socketUrl = "http://localhost:";
Setup.restPort = 3000;
Setup.restUrl = "http://localhost:";
//# sourceMappingURL=Setup.js.map