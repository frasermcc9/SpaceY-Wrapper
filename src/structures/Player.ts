import { get as httpGet } from "http";
import { httpRequest, BaseRequest } from "../functions/httpRequest";
import { retrieveItem } from "../functions/ItemRetriever";
import { Setup } from "../settings/Setup";
import { Attachment, Faction, Ship } from "./GameAsset";
import { MapNode, LocationAsteroids } from "./MapNode";
import { AttachmentType } from "./Constants";

export class Player implements ClientPlayer {
    //#region Fields
    inventory!: {
        credits: number;
        tokens: number;
        cargoString: string;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
    uId!: string;
    ship!: PlayerShip;
    skin!: { skinUri: string; skinName: string };
    skins!: { skinUri: string; skinName: string }[];
    location!: string;
    blueprints!: string[];
    exp!: number;
    skills!: [number, number, number];
    dateOfEntry!: Date;
    lastUpdated!: Date;
    //#endregion

    static async create(uId: string): Promise<ClientPlayer> {
        return new Player(await this.getPlayer(uId));
    }

    private constructor(data: PlayerData) {
        Object.assign(this, data);
    }

    async currentLocation(): Promise<MapNode> {
        const req = (await httpRequest("location/" + this.location)) as BaseRequest<MapNode>;
        if (req.status == "200") {
            return req.data!;
        } else {
            return Promise.reject("Current location could not be retrieved.");
        }
    }

    async adjacentLocations(): Promise<MapNode[]> {
        return (await this.currentLocation()).adjacent;
    }
    async profile(): Promise<PlayerProfile> {
        return {
            credits: this.inventory.credits,
            tokens: this.inventory.tokens,
            skills: this.skills,
            image: await this.playerImage(),
            bestFaction: await this.bestFaction(),
            ship: this.ship,
            level: this.Level,
            location: this.location,
            exp: this.exp,
            expToNext: this.ExpToNextLevel,
            cargoString: this.inventory.cargoString,
        };
    }

    get Level(): number {
        return Player.inverseExpFunction(this.exp);
    }
    get ExpToNextLevel(): number {
        return Math.ceil(Player.expFunction(this.Level + 1) - this.exp);
    }

    parseForServer(): ServerPlayer {
        return {
            blueprints: this.blueprints,
            exp: this.exp,
            inventory: this.inventory,
            location: this.location,
            ship: { name: this.ship.name, equipped: this.ship.equipped?.map((a) => a.name) ?? [] },
            skills: this.skills,
            uId: this.uId,
            skin: this.skin,
            skins: this.skins,
        };
    }

    async regionAsteroids(): Promise<LocationAsteroids> {
        return (await httpRequest(
            "location/" + this.location + "/" + this.uId + "/regionasteroids"
        )) as LocationAsteroids;
    }

    availableSlots() {
        const returnValue = new Map<AttachmentType, number>();
        for (const key in this.ship.availableSlots) {
            const ordinal = Number(key) as AttachmentType;
            returnValue.set(ordinal, this.ship.availableSlots[ordinal]);
        }
        return returnValue;
    }

    hasBlueprint(item: string): boolean {
        return this.blueprints.includes(item);
    }

    /**Gets the amount of the given item */
    amountInInventory(item: string): number {
        return (
            this.inventory.attachments.get(item) ||
            this.inventory.materials.get(item) ||
            this.inventory.reputation.get(item) ||
            this.inventory.ships.get(item) ||
            0
        );
    }

    //#region private helpers

    /**
     * Returns cumulative xp required to reach a level
     * @param x the level
     * @returns the cumulative xp to reach this level
     */
    private static expFunction(x: number) {
        return (5 / 9) * (x + 1) * (4 * x ** 2 - 4 * x + 27);
    }
    /**
     * Returns the level that a player with xp *x* would be
     * @param x the cumulative xp of the player
     * @returns the level that the player would be
     */
    private static inverseExpFunction(x: number) {
        for (let i = 0; ; i++) {
            if (this.expFunction(i) > x) {
                return i - 1;
            }
        }
    }

    private async playerImage(): Promise<string> {
        if (this.skin.skinUri != "") {
            return this.skin.skinUri;
        } else {
            const ship = await retrieveItem<Ship>(this.ship.name);
            if (ship.status == "200") {
                return ship.item!.imageUri;
            } else {
                throw new TypeError(`Could not GET ship '${this.ship.name}'.`);
            }
        }
    }

    private async bestFaction(): Promise<Faction> {
        let bestFaction: string = "",
            bestValue = -Infinity;
        this.inventory.reputation.forEach((val, fac) => {
            if (val > bestValue) bestFaction = fac;
        });
        const returnValue = await retrieveItem<Faction>(bestFaction);
        if (returnValue.status == "200") {
            return returnValue.item!;
        } else {
            throw new TypeError(`Could not GET faction '${bestFaction}'.`);
        }
    }

    //#endregion

    //statics
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
}

export interface ClientPlayer extends PlayerData {
    Level: number;
    ExpToNextLevel: number;
    adjacentLocations(): Promise<MapNode[]>;
    currentLocation(): Promise<MapNode>;
    profile(): Promise<PlayerProfile>;
    regionAsteroids(): Promise<LocationAsteroids>;
    parseForServer(): ServerPlayer;
    availableSlots(): Map<AttachmentType, number>;
    hasBlueprint(item: string): boolean;
    amountInInventory(item: string): number;
}

export interface PlayerData extends PlayerBase {
    inventory: {
        credits: number;
        tokens: number;
        cargoString: string;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
}
export interface PreProcessPlayer extends PlayerBase {
    inventory: {
        credits: number;
        tokens: number;
        cargoString: string;
        materials: Object;
        ships: Object;
        attachments: Object;
        reputation: Object;
    };
}
interface PlayerBase {
    uId: string;
    ship: PlayerShip;
    skin?: { skinUri: string; skinName: string };
    skins?: { skinUri: string; skinName: string }[];
    location: string;
    blueprints: string[];
    exp: number;
    skills: [number, number, number];
    dateOfEntry?: Date;
    lastUpdated?: Date;
}

/**
 * Interface for raw player data acceptable to sending through the websocket
 */
export interface ServerPlayer {
    uId: string;
    ship: { name: string; equipped: string[] };
    skin?: { skinUri: string; skinName: string };
    skins?: { skinUri: string; skinName: string }[];
    inventory: {
        credits: number;
        tokens: number;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
    location: string;
    blueprints: string[];
    exp: number;
    skills: [number, number, number];
}

interface PlayerShip {
    name: string;
    description: string;
    techLevel: number;
    equipped?: Attachment[];
    baseStats: {
        baseHp: number;
        baseShield: number;
        baseEnergy?: number[] | null;
        baseCargo: number;
        baseHandling: number;
    };
    playerStats: {
        hp: number;
        shield: number;
        handling: number;
        cargo: number;
        energy?: number[] | null;
    };
    weaponCapacities: ShipSlots;
    availableSlots: ShipSlots;
    maxTech: number;
    strength: number;
    baseShip: Ship;
}
interface PlayerProfile {
    credits: number;
    tokens: number;
    skills: [number, number, number];
    image: string;
    bestFaction: Faction;
    ship: PlayerShip;
    level: number;
    location: string;
    exp: number;
    expToNext: number;
    cargoString: string;
}
interface ShipSlots {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
}
