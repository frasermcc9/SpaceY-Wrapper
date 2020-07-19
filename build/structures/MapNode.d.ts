import { Faction } from "./GameAsset";
export interface MapNode {
    status: string;
    location: MapNodeBase;
}
interface MapNodeBase {
    name: string;
    faction: Faction;
    requiredWarp: number;
    techLevel: number;
    imageUri: string;
}
export {};
