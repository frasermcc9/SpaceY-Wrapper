import { SpaceClient } from "../client/Client";
import { MapCollection } from "../extensions/MapCollection";
export declare class Store implements StoreData {
    private readonly store;
    private readonly client;
    private _inventory;
    private _costs;
    private _credits;
    private _identity;
    get inventory(): MapCollection<string, number>;
    get costs(): MapCollection<string, number>;
    get credits(): number;
    get identity(): string;
    private constructor();
    static create(store: string, client: SpaceClient): Promise<Store>;
    private initStock;
    storeStock(): StoreData;
    refreshCache(): Promise<StoreData>;
    /**
     * buy (from player perspective)
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    buy(item: string, quantity: number): Promise<{
        success: boolean;
        msg: string;
    }>;
    /**
     * sell (from player perspective)
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    sell(item: string, quantity: number): Promise<{
        success: boolean;
        msg: string;
    }>;
    /**
     * force sell (from player perspective). Force sell means selling even if
     * the store has insufficient credits. The store will buy, and pay what it
     * can afford.
     * @param item the item the player is buying from the store
     * @param quantity the amount of the item
     */
    forceSell(item: string, quantity: number): Promise<{
        success: boolean;
        msg: string;
    }>;
    /**
     * edits the cache, from the perspective of the store (ie positive quantity
     * means store is buying from player). Prevents unnecessary API calls by
     * calculating store stock locally.
     * @param item the item to trade
     * @param quantity the quantity (positive if store buys, negative if store sells)
     */
    private editCache;
}
export interface StoreData {
    identity: string;
    inventory: MapCollection<string, number>;
    costs: MapCollection<string, number>;
    credits: number;
}
