import { Blueprint } from "./Blueprint";

export interface Ship {
    name: string;
    description: string;
    cost: number;
    blueprint: Blueprint;
    techLevel: number;
    AttachmentCaps: AttachmentCapsOrCollection;
    subclass: string;
    baseHp: number;
    baseShield: number;
    baseEnergy?: number[] | null;
    baseCargo: number;
    baseHandling: number;
    imageUri: string;
    maxTech: number;
    strength: number;
}