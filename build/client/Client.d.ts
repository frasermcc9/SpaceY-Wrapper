/// <reference types="socket.io-client" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { ClientPlayer } from "../structures/Player";
import { ItemTypes } from "../structures/Constants";
import { MapCollection } from "../extensions/MapCollection";
import { Store } from "../structures/Store";
export declare class SpaceClient extends EventEmitter {
    protected socket: SocketIOClient.Socket;
    protected clientId: string;
    protected player: ClientPlayer;
    private constructor();
    static create(uId: string): Promise<SpaceClient>;
    update(data: string): Promise<void>;
    on<K extends keyof ServerEvents>(event: K, listener: (args: ServerEvents[K]) => void): this;
    emit<K extends keyof ClientPlayerEventsRequired>(event: K, args: ClientPlayerEventsRequired[K]): boolean;
    /**
     * Recommended way to fire events across the websocket. Takes generic
     * parameter of the event, types are then inherited from the interface of
     * events. Will return a promise of the server's response to the event.
     * @param event the event to fire. Implicitly gives method type parameter.
     * @param args destructured object arguments based on event type
     *
     * @returns server response object
     */
    action<K extends keyof ClientPlayerEventsRequired>(event: K, args: ClientPlayerEventsRequired[K]): Promise<ServerEvents["res"]>;
    /**
     * Rejects promise if server response is unsuccessful. <br />  \
     * Otherwise, identical behaviour to:
     * ```js
     * this.action<K>( event: K, args: ClientPlayerEventsRequired[K])
     * ```
     */
    strictAction<K extends keyof ClientPlayerEventsRequired>(event: K, args: ClientPlayerEventsRequired[K]): Promise<ServerEvents["res"]>;
    get Player(): ClientPlayer;
    findAll<T extends keyof ItemTypes>(e: T): Promise<Map<string, ItemTypes[T]>>;
    findBlueprint(item: string): Promise<{
        result: boolean;
        blueprint?: MapCollection<string, number>;
    }>;
    createStoreConnection(store: string): Promise<Store>;
    disconnect: Function;
    destroy: Function;
    close: Function;
}
interface ClientPlayerEventsRequired {
    warp: {
        locationName: string;
    };
    createSkin: {
        skinName: string;
        uri: string;
    };
    equipSkin: {
        skinName: string;
    };
    removeSkin: {};
    mine: {
        asteroidName: string;
    };
    buy: {
        storeName: string;
        itemName: string;
        quantity: number;
    };
    sell: {
        storeName: string;
        itemName: string;
        quantity: number;
    };
    forceSell: {
        storeName: string;
        itemName: string;
        quantity: number;
    };
    equip: {
        attachment: string;
    };
}
interface ServerEvents {
    res: {
        success: boolean;
        msg: string;
        playerStringified: string;
    };
}
export {};
