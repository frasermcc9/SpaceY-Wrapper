export interface Material {
    status: string;
    item: Item;
}
export interface Item {
    name: string;
    description: string;
    cost: number;
    techLevel: number;
    mineable: boolean;
    rarity: number;
}
