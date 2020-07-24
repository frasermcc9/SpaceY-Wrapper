export interface BaseItem {
    name: string;
    description: string;
    techLevel: number;
    /**base cost (not guaranteed) */
    cost: number;
}
export interface Base<K extends BaseItem> {
    status: string;
    item?: K;
}
export interface Material extends BaseItem {
    mineable: boolean;
    rarity: number;
}
export interface Ship extends BaseItem {
    subclass: string;
    baseHp: number;
    baseShield: number;
    baseEnergy?: number[];
    baseCargo: number;
    baseHandling: number;
    imageUri: string;
    maxTech: number;
    strength: number;
}
export interface Attachment extends BaseItem {
    energyCost?: number[];
    type: number;
    strength: number;
}
export interface Faction extends BaseItem {
    soldShips?: Base<Ship>[];
    usedShips?: Base<Ship>[];
    soldAttachments?: Base<Attachment>[];
    usedAttachments?: Base<Attachment>[];
    imageUri: string;
}
