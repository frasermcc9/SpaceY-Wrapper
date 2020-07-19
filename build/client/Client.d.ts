/// <reference types="node" />
import { EventEmitter } from "events";
import { LocationName, Msg, SkinName, Uri, Result, AsteroidName, StoreName, ItemName, Quantity } from "../structures/Primitives";
import { PlayerData, IPlayer } from "../structures/Player";
declare class Client extends EventEmitter {
    private socket;
    private clientId;
    private player;
    constructor(clientId: string, player: PlayerData);
    on<K extends keyof ServerEvents>(event: K, listener: (...args: ServerEvents[K]) => void): this;
    emit<K extends keyof ClientPlayerEvents>(event: K, ...args: ClientPlayerEvents[K]): boolean;
    action<K extends keyof ClientPlayerEvents>(event: K, ...args: ClientPlayerEvents[K]): Promise<{
        player?: PlayerData;
        msg?: string;
        success: boolean;
    }>;
    get Player(): IPlayer;
    static getPlayer(clientId: string): Promise<PlayerData>;
    private static requestPlayer;
    disconnect(): void;
}
export declare function init(clientId: string): Promise<Client>;
interface ClientPlayerEvents {
    warp: [LocationName];
    createSkin: [SkinName, Uri];
    equipSkin: [SkinName];
    removeSkin: [];
    mine: [AsteroidName];
    buy: [StoreName, ItemName, Quantity];
    sell: [StoreName, ItemName, Quantity];
    forceSell: [StoreName, ItemName, Quantity];
}
interface ServerEvents {
    res: [Result, Msg, PlayerData];
}
export {};
