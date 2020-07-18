"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const events_1 = require("events");
const Setup_1 = require("../settings/Setup");
const http_1 = require("http");
const json_stringify_safe_1 = __importDefault(require("json-stringify-safe"));
class Client extends events_1.EventEmitter {
    constructor(clientId, player) {
        super();
        this.socket = socket_io_client_1.default.connect(Setup_1.Setup.socketUrl + Setup_1.Setup.socketPort);
        this.clientId = clientId;
        this.player = player;
    }
    static async create(clientId) {
        const player = await this.getPlayer(clientId);
        return new Client(clientId, player);
    }
    on(event, listener) {
        this.socket.on(event, listener);
        return this;
    }
    emit(event, ...args) {
        const argsIn = [this.player, args];
        return this.socket.emit(event, ...argsIn).hasListeners(event);
    }
    action(event, ...args) {
        return new Promise((resolve, reject) => {
            this.socket.once("res", (result, msg, player) => {
                if (result.valueOf()) {
                    resolve({ player: player, msg: msg.valueOf() });
                }
                else {
                    reject("ERROR: " + msg);
                }
            });
            const argsIn = [json_stringify_safe_1.default(this.player), ...args];
            this.socket.emit(event, argsIn);
        });
    }
    static async getPlayer(clientId) {
        const base = (await this.requestPlayer(clientId));
        base.inventory.attachments = new Map(Object.entries(base.inventory.attachments));
        base.inventory.materials = new Map(Object.entries(base.inventory.materials));
        base.inventory.reputation = new Map(Object.entries(base.inventory.reputation));
        base.inventory.ships = new Map(Object.entries(base.inventory.ships));
        return base;
    }
    static async requestPlayer(id) {
        return new Promise((resolve) => {
            let data = "";
            http_1.get(Setup_1.Setup.restUrl + Setup_1.Setup.restPort + "/user/" + id, (res) => {
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    resolve(JSON.parse(data));
                });
            });
        });
    }
    disconnect() {
        this.socket.close();
    }
}
async function createClient(clientId) {
    return new Client(clientId, await Client.getPlayer(clientId));
}
exports.createClient = createClient;
