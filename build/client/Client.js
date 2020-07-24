"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceClient = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const events_1 = require("events");
const Setup_1 = require("../settings/Setup");
const Player_1 = require("../structures/Player");
const httpRequest_1 = require("../functions/httpRequest");
const MapCollection_1 = require("../extensions/MapCollection");
const Store_1 = require("../structures/Store");
class SpaceClient extends events_1.EventEmitter {
    constructor(player) {
        super();
        this.disconnect = () => this.socket.close();
        this.destroy = this.disconnect;
        this.close = this.disconnect;
        this.socket = socket_io_client_1.default.connect(Setup_1.Setup.socketUrl + Setup_1.Setup.socketPort);
        this.clientId = player.uId;
        this.player = player;
    }
    static async create(uId) {
        return new SpaceClient(await Player_1.Player.create(uId));
    }
    async update(data) {
        const parsed = JSON.parse(data);
        this.player = await Player_1.Player.create(parsed.uId);
    }
    on(event, listener) {
        this.socket.on(event, listener);
        return this;
    }
    emit(event, args) {
        return this.socket.emit(event, { ...args, ...{ id: this.clientId } }).hasListeners(event);
    }
    /**
     * Recommended way to fire events across the websocket. Takes generic
     * parameter of the event, types are then inherited from the interface of
     * events. Will return a promise of the server's response to the event.
     * @param event the event to fire. Implicitly gives method type parameter.
     * @param args destructured object arguments based on event type
     *
     * @returns server response object
     */
    action(event, args) {
        return new Promise((resolve) => {
            this.socket.once("res", (e) => {
                resolve(e);
            });
            //@ts-ignore
            const eventArgs = { ...args, ...{ id: this.clientId } };
            this.socket.emit(event, eventArgs);
        });
    }
    /**
     * Rejects promise if server response is unsuccessful. <br />  \
     * Otherwise, identical behaviour to:
     * ```js
     * this.action<K>( event: K, args: ClientPlayerEventsRequired[K])
     * ```
     */
    strictAction(event, args) {
        return new Promise((resolve, reject) => {
            this.socket.once("res", (e) => {
                if (e.success)
                    resolve(e);
                reject(e.msg);
            });
            //@ts-ignore
            const eventArgs = { ...args, ...{ id: this.clientId } };
            this.socket.emit(event, eventArgs);
        });
    }
    get Player() {
        return this.player;
    }
    async findAll(e) {
        const registered = await httpRequest_1.httpRequest("registry/" + e);
        return new Map(Object.entries(registered));
    }
    async findBlueprint(item) {
        const obj = (await httpRequest_1.httpRequest("item/" + item + "/blueprint"));
        if (obj.hasOwnProperty("status") && obj.hasOwnProperty("data")) {
            if (obj.status == "200") {
                return {
                    result: true,
                    blueprint: new MapCollection_1.MapCollection(Object.entries(obj.data)),
                };
            }
            else {
                return { result: false };
            }
        }
        else {
            return { result: false };
        }
    }
    createStoreConnection(store) {
        return Store_1.Store.create(store, this);
    }
}
exports.SpaceClient = SpaceClient;
//# sourceMappingURL=Client.js.map