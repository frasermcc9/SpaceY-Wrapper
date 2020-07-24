import { httpRequest, BaseRequest } from "../functions/httpRequest";
import { SpaceClient } from "../client/Client";
import { MapCollection } from "../extensions/MapCollection";

export class Store implements StoreData {
    private _inventory!: MapCollection<string, number>;
    private _costs!: MapCollection<string, number>;
    private _credits!: number;
    private _identity!: string;

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

    private constructor(private readonly store: string, private readonly client: SpaceClient) {}

    static async create(store: string, client: SpaceClient): Promise<Store> {
        const s = new Store(store, client);
        await s.initStock();
        return s;
    }

    private async initStock(): Promise<void> {
        const req = (await httpRequest(
            `location/${this.client.Player.location}/${this.store}/inventory`
        )) as BaseRequest<StoreStock>;
        if (req.status == "200") {
            this._inventory = new MapCollection(Object.entries(req.data?.inventory!));
            this._costs = new MapCollection(Object.entries(req.data?.costs!));
            this._credits = req.data?.credits!;
            this._identity = req.data?.identity!;
        } else {
            return Promise.reject(req.status);
        }
    }

    storeStock(): StoreData {
        return this;
    }

    async refreshCache(): Promise<StoreData> {
        await this.initStock();
        return this.storeStock();
    }

    /**
     * buy (from player perspective)
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    async buy(item: string, quantity: number) {
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
    async sell(item: string, quantity: number) {
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
    async forceSell(item: string, quantity: number) {
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
    private editCache(item: string, quantity: number) {
        this._credits -= (this._costs.get(item) ?? 0) * quantity;
        this._inventory.set(item, (this._inventory.get(item) ?? 0) + quantity);
    }
}

interface StoreStock {
    identity: string;
    credits: number;
    inventory: { [k: string]: number };
    costs: { [k: string]: number };
}

export interface StoreData {
    identity: string;
    inventory: MapCollection<string, number>;
    costs: MapCollection<string, number>;
    credits: number;
}
