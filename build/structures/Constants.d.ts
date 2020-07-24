import { Material, Attachment, Ship, Faction } from "./GameAsset";
export declare enum WarpPower {
    NONE = 0,
    LOW = 1,
    MODERATE = 2,
    HIGH = 3
}
export interface ItemTypes {
    materials: Material;
    attachments: Attachment;
    ships: Ship;
    factions: Faction;
}
export declare enum AttachmentType {
    GENERAL = 0,
    PRIMARY = 1,
    HEAVY = 2,
    SHIELD = 3,
    MINER = 4
}
