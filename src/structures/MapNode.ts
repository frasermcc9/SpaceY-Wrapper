import { Faction } from "./GameAsset";

export interface MapNode {
    /**Map node name */
    name: string;
    /**Faction this map node is in */
    faction: Faction;
    /**Required warp to travel */
    requiredWarp: number;
    /**tech level of this node */
    techLevel: number;
    /**this nodes general location on the map */
    imageUri: string;
    /**adjacent nodes */
    adjacent: MapNode[];
    /**store names and descriptions in this region (single string)*/
    stores: string[];
    /**object literal of the asteroid name and its approx value */
    asteroids: { name: string; value: number }[];
}

export interface LocationAsteroids {
    status: string;
    asteroids: {
        available: string[];
        unavailable: { name: string; cooldown: number }[];
    };
}