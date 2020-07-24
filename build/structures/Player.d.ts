import { Attachment, Faction, Ship } from "./GameAsset";
import { MapNode, LocationAsteroids } from "./MapNode";
import { AttachmentType } from "./Constants";
export declare class Player implements ClientPlayer {
    inventory: {
        credits: number;
        tokens: number;
        cargoString: string;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
    uId: string;
    ship: PlayerShip;
    skin: {
        skinUri: string;
        skinName: string;
    };
    skins: {
        skinUri: string;
        skinName: string;
    }[];
    location: string;
    blueprints: string[];
    exp: number;
    skills: [number, number, number];
    dateOfEntry: Date;
    lastUpdated: Date;
    static create(uId: string): Promise<ClientPlayer>;
    private constructor();
    currentLocation(): Promise<MapNode>;
    adjacentLocations(): Promise<MapNode[]>;
    profile(): Promise<PlayerProfile>;
    get Level(): number;
    get ExpToNextLevel(): number;
    parseForServer(): ServerPlayer;
    regionAsteroids(): Promise<LocationAsteroids>;
    availableSlots(): Map<AttachmentType, number>;
    hasBlueprint(item: string): boolean;
    /**Gets the amount of the given item */
    amountInInventory(item: string): number;
    /**
     * Returns cumulative xp required to reach a level
     * @param x the level
     * @returns the cumulative xp to reach this level
     */
    private static expFunction;
    /**
     * Returns the level that a player with xp *x* would be
     * @param x the cumulative xp of the player
     * @returns the level that the player would be
     */
    private static inverseExpFunction;
    private playerImage;
    private bestFaction;
    static getPlayer(clientId: string): Promise<PlayerData>;
    private static requestPlayer;
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
    skin?: {
        skinUri: string;
        skinName: string;
    };
    skins?: {
        skinUri: string;
        skinName: string;
    }[];
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
    ship: {
        name: string;
        equipped: string[];
    };
    skin?: {
        skinUri: string;
        skinName: string;
    };
    skins?: {
        skinUri: string;
        skinName: string;
    }[];
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
export {};
