import client from "socket.io-client";
import { EventEmitter } from "events";
import { Id, Location, Msg, SkinName, Uri, Result } from "../structures/Primitives";
import { Setup } from "../settings/Setup";
import { get as httpGet } from "http";
import { Player, PreProcessPlayer } from "../structures/Player";
import stringify from "json-stringify-safe";

class Client extends EventEmitter {
	private socket!: SocketIOClient.Socket;

	private clientId: string;
	private player: Player;

	constructor(clientId: string, player: Player) {
		super();
		this.socket = client.connect(Setup.socketUrl + Setup.socketPort);
		this.clientId = clientId;
		this.player = player;
	}

	public static async create(clientId: string) {
		const player = await this.getPlayer(clientId);
		return new Client(clientId, player);
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
	): Promise<{ player?: Player; msg?: string }> {
		return new Promise((resolve, reject) => {
			this.socket.once("res", (result: Result, msg: Msg, player: Player) => {
				if (result.valueOf()) {
					resolve({ player: player, msg: msg.valueOf() });
				} else {
					reject("ERROR: " + msg);
				}
			});
			const argsIn = [stringify(this.player), ...args];
			this.socket.emit(event, argsIn);
		});
	}

	public static async getPlayer(clientId: string) {
		const base = (await this.requestPlayer(clientId)) as PreProcessPlayer;
		base.inventory.attachments = new Map(Object.entries(base.inventory.attachments));
		base.inventory.materials = new Map(Object.entries(base.inventory.materials));
		base.inventory.reputation = new Map(Object.entries(base.inventory.reputation));
		base.inventory.ships = new Map(Object.entries(base.inventory.ships));
		return base as Player;
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

export async function createClient(clientId: string) {
	return new Client(clientId, await Client.getPlayer(clientId));
}

interface ClientPlayerEvents {
	warp: [Location];
	createSkin: [SkinName, Uri];
	equipSkin: [SkinName];
	removeSkin: [];
}

interface ServerEvents {
	res: [Result, Msg, Player];
}
