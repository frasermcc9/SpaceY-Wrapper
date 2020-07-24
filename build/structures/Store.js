"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const httpRequest_1 = require("../functions/httpRequest");
const MapCollection_1 = require("../extensions/MapCollection");
class Store {
    constructor(store, client) {
        this.store = store;
        this.client = client;
    }
    get inventory() {
        return this._inventory;
    }
    get costs() {
        return this._costs;
    }
    get credits() {
        return this._credits;
    }
    get identity() {
        return this._identity;
    }
    static async create(store, client) {
        const s = new Store(store, client);
        await s.initStock();
        return s;
    }
    async initStock() {
        const req = (await httpRequest_1.httpRequest(`location/${this.client.Player.location}/${this.store}/inventory`));
        if (req.status == "200") {
            this._inventory = new MapCollection_1.MapCollection(Object.entries(req.data?.inventory));
            this._costs = new MapCollection_1.MapCollection(Object.entries(req.data?.costs));
            this._credits = req.data?.credits;
            this._identity = req.data?.identity;
        }
        else {
            return Promise.reject(req.status);
        }
    }
    storeStock() {
        return this;
    }
    async refreshCache() {
        await this.initStock();
        return this.storeStock();
    }
    /**
     * buy (from player perspective)
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    async buy(item, quantity) {
        const res = await this.client.action("buy", { itemName: item, quantity: quantity, storeName: this.store });
        if (res.success) {
            this.editCache(item, -quantity);
            await this.client.update(res.playerStringified);
        }
        return { success: res.success, msg: res.msg };
    }
    /**
     * sell (from player perspective)
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    async sell(item, quantity) {
        const res = await this.client.action("sell", { itemName: item, quantity: quantity, storeName: this.store });
        if (res.success) {
            this.editCache(item, quantity);
            await this.client.update(res.playerStringified);
        }
        return { success: res.success, msg: res.msg };
    }
    /**
     * force sell (from player perspective). Force sell means selling even if
     * the store has insufficient credits. The store will buy, and pay what it
     * can afford.
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    async forceSell(item, quantity) {
        const res = await this.client.action("forceSell", {
            itemName: item,
            quantity: quantity,
            storeName: this.store,
        });
        if (res.success) {
            this.editCache(item, quantity);
            await this.client.update(res.playerStringified);
        }
        return { success: res.success, msg: res.msg };
    }
    /**
     * edits the cache, from the perspective of the store (ie positive quantity
     * means store is buying from player). Prevents unnecessary API calls by
     * calculating store stock locally.
     * @param item the item to trade
     * @param quantity the quantity (positive if store buys, negative if store sells)
     */
    editCache(item, quantity) {
        this._credits -= (this._costs.get(item) ?? 0) * quantity;
        this._inventory.set(item, (this._inventory.get(item) ?? 0) + quantity);
    }
}
exports.Store = Store;
//# sourceMappingURL=Store.js.map