import { httpRequest } from "../functions/httpRequest";
import { MapNode } from "./MapNode";
import { retrieveItem } from "../functions/ItemRetriever";
import { Server } from "http";
import { Ship, Faction, Attachment } from "./GameAsset";

export class Player implements IPlayer {
    //#region Fields
    inventory!: {
        credits: number;
        tokens: number;
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
    constructor(data: PlayerData) {
        Object.assign(this, data);
    }
    async currentLocation(): Promise<MapNode> {
        return (await httpRequest("location/" + this.location)) as MapNode;
    }

    async adjacentLocations(): Promise<MapNode[]> {
        return (await httpRequest("user/" + this.uId + "/adjacent")) as MapNode[];
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
        };
    }

    public get Level(): number {
        return Player.inverseExpFunction(this.exp);
    }
    public get ExpToNextLevel(): number {
        return Math.ceil(Player.expFunction(this.Level + 1) - this.exp);
    }

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
        if (this.skin != undefined) {
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
}

export interface IPlayer extends PlayerData {
    adjacentLocations(): Promise<MapNode[]>;
    currentLocation(): Promise<MapNode>;
    profile(): Promise<PlayerProfile>;
}

export interface PlayerData extends PlayerBase {
    inventory: {
        credits: number;
        tokens: number;
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
    equippedSlots: ShipSlots;
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
}
interface ShipSlots {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
}
