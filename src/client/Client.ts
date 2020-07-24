import client from "socket.io-client";
import { EventEmitter } from "events";
import { Setup } from "../settings/Setup";
import { PlayerData, ClientPlayer, Player } from "../structures/Player";
import { httpRequest } from "../functions/httpRequest";
import { ItemTypes } from "../structures/Constants";
import { MapCollection } from "../extensions/MapCollection";
import { Store } from "../structures/Store";

export class SpaceClient extends EventEmitter {
    protected socket!: SocketIOClient.Socket;

    protected clientId: string;
    protected player: ClientPlayer;

    private constructor(player: ClientPlayer) {
        super();
        this.socket = client.connect(Setup.socketUrl + Setup.socketPort);
        this.clientId = player.uId;
        this.player = player;
    }

    static async create(uId: string) {
        return new SpaceClient(await Player.create(uId));
    }
    public async update(data: string) {
        const parsed = JSON.parse(data) as PlayerData;
        this.player = await Player.create(parsed.uId);
    }

    public on<K extends keyof ServerEvents>(event: K, listener: (args: ServerEvents[K]) => void): this {
        this.socket.on(event, listener);
        return this;
    }

    public emit<K extends keyof ClientPlayerEventsRequired>(event: K, args: ClientPlayerEventsRequired[K]): boolean {
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
    public action<K extends keyof ClientPlayerEventsRequired>(
        event: K,
        args: ClientPlayerEventsRequired[K]
    ): Promise<ServerEvents["res"]> {
        return new Promise((resolve) => {
            this.socket.once("res", (e: ServerEvents["res"]) => {
                resolve(e);
            });
            //@ts-ignore
            const eventArgs: ClientPlayerEvents[K] = { ...args, ...{ id: this.clientId } };
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
    public strictAction<K extends keyof ClientPlayerEventsRequired>(
        event: K,
        args: ClientPlayerEventsRequired[K]
    ): Promise<ServerEvents["res"]> {
        return new Promise((resolve, reject) => {
            this.socket.once("res", (e: ServerEvents["res"]) => {
                if (e.success) resolve(e);
                reject(e.msg);
            });
            //@ts-ignore
            const eventArgs: ClientPlayerEvents[K] = { ...args, ...{ id: this.clientId } };
            this.socket.emit(event, eventArgs);
        });
    }

    public get Player(): ClientPlayer {
        return this.player;
    }

    public async findAll<T extends keyof ItemTypes>(e: T): Promise<Map<string, ItemTypes[T]>> {
        const registered = await httpRequest("registry/" + e);
        return new Map(Object.entries(registered));
    }

    public async findBlueprint(item: string): Promise<{ result: boolean; blueprint?: MapCollection<string, number> }> {
        const obj = (await httpRequest("item/" + item + "/blueprint")) as { status: any; data: any };
        if (obj.hasOwnProperty("status") && obj.hasOwnProperty("data")) {
            if (obj.status == "200") {
                return {
                    result: true,
                    blueprint: new MapCollection(Object.entries(obj.data)) as MapCollection<string, number>,
                };
            } else {
                return { result: false };
            }
        } else {
            return { result: false };
        }
    }

    public createStoreConnection(store: string): Promise<Store> {
        return Store.create(store, this);
    }

    public disconnect: Function = () => this.socket.close();
    public destroy: Function = this.disconnect;
    public close: Function = this.disconnect;
}

interface ClientPlayerEventsRequired {
    warp: { locationName: string };

    createSkin: { skinName: string; uri: string };
    equipSkin: { skinName: string };
    removeSkin: {};

    mine: { asteroidName: string };

    buy: { storeName: string; itemName: string; quantity: number };
    sell: { storeName: string; itemName: string; quantity: number };
    forceSell: { storeName: string; itemName: string; quantity: number };

    equip: { attachment: string };
}

interface ClientPlayerEvents {
    warp: { id: string; locationName: string };

    createSkin: { id: string; skinName: string; uri: string };
    equipSkin: { id: string; skinName: string };
    removeSkin: { id: string };

    mine: { id: string; asteroidName: string };

    buy: { id: string; storeName: string; itemName: string; quantity: number };
    sell: { id: string; storeName: string; itemName: string; quantity: number };
    forceSell: { id: string; storeName: string; itemName: string; quantity: number };

    equip: { id: string; attachment: string };
}

interface ServerEvents {
    res: { success: boolean; msg: string; playerStringified: string };
}
