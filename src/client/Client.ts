import client from "socket.io-client";
import { EventEmitter } from "events";
import { Id, LocationName, Msg, SkinName, Uri, Result, AsteroidName, StoreName, ItemName, Quantity } from "../structures/Primitives";
import { Setup } from "../settings/Setup";
import { get as httpGet } from "http";
import { PlayerData, PreProcessPlayer, Player, IPlayer } from "../structures/Player";
import stringify from "json-stringify-safe";

class Client extends EventEmitter {
    private socket!: SocketIOClient.Socket;

    private clientId: string;
    private player: IPlayer;

    constructor(clientId: string, player: PlayerData) {
        super();
        this.socket = client.connect(Setup.socketUrl + Setup.socketPort);
        this.clientId = clientId;
        this.player = new Player(player);
    }

    public on<K extends keyof ServerEvents>(event: K, listener: (...args: ServerEvents[K]) => void): this {
        this.socket.on(event, listener);
        return this;
    }

    public emit<K extends keyof ClientPlayerEvents>(event: K, ...args: ClientPlayerEvents[K]): boolean {
        const argsIn = [this.player, args];
        return this.socket.emit(event, ...argsIn).hasListeners(event);
    }

    public action<K extends keyof ClientPlayerEvents>(
        event: K,
        ...args: ClientPlayerEvents[K]
    ): Promise<{ player?: PlayerData; msg?: string; success: boolean }> {
        return new Promise((resolve, reject) => {
            this.socket.once("res", (result: Result, msg: Msg, player: PlayerData) => {
                resolve({ player: player, msg: msg.valueOf(), success: result.valueOf() });
            });
            const argsIn = [stringify(this.player), ...args];
            this.socket.emit(event, argsIn);
        });
    }

    public get Player(): IPlayer {
        return this.player;
    }

    public static async getPlayer(clientId: string) {
        const base = (await this.requestPlayer(clientId)) as PreProcessPlayer;
        base.inventory.attachments = new Map(Object.entries(base.inventory.attachments));
        base.inventory.materials = new Map(Object.entries(base.inventory.materials));
        base.inventory.reputation = new Map(Object.entries(base.inventory.reputation));
        base.inventory.ships = new Map(Object.entries(base.inventory.ships));
        return base as PlayerData;
    }

    private static async requestPlayer(id: string) {
        return new Promise((resolve) => {
            let data = "";
            httpGet(Setup.restUrl + Setup.restPort + "/user/" + id, (res) => {
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    resolve(JSON.parse(data));
                });
            });
        });
    }

    public disconnect() {
        this.socket.close();
    }
}

export async function init(clientId: string) {
    return new Client(clientId, await Client.getPlayer(clientId));
}

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
