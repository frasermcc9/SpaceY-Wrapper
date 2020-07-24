import { Material, Attachment, Ship, Faction } from "./GameAsset";

export enum WarpPower {
    NONE,
    LOW,
    MODERATE,
    HIGH,
}

export interface ItemTypes {
    materials: Material;
    attachments: Attachment;
    ships: Ship;
    factions: Faction;
}

export enum AttachmentType {
    GENERAL,
    PRIMARY,
    HEAVY,
    SHIELD,
    MINER,
}
