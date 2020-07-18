/// <reference types="node" />
import { EventEmitter } from "events";
import { Location, Msg, SkinName, Uri, Result } from "../structures/Primitives";
import { Player } from "../structures/Player";
declare class Client extends EventEmitter {
    private socket;
    private clientId;
    private player;
    constructor(clientId: string, player: Player);
    static create(clientId: string): Promise<Client>;
    on<K extends keyof ServerEvents>(event: K, listener: (...args: ServerEvents[K]) => void): this;
    emit<K extends keyof ClientPlayerEvents>(event: K, ...args: ClientPlayerEvents[K]): boolean;
    action<K extends keyof ClientPlayerEvents>(event: K, ...args: ClientPlayerEvents[K]): Promise<{
        player?: Player;
        msg?: string;
    }>;
    static getPlayer(clientId: string): Promise<Player>;
    private static requestPlayer;
    disconnect(): void;
}
export declare function createClient(clientId: string): Promise<Client>;
interface ClientPlayerEvents {
    warp: [Location];
    createSkin: [SkinName, Uri];
    equipSkin: [SkinName];
    removeSkin: [];
}
interface ServerEvents {
    res: [Result, Msg, Player];
}
export {};
