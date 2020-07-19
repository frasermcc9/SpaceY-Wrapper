import { Blueprint } from "./Blueprint";
export interface Attachment {
    name: string;
    description: string;
    cost: number;
    blueprint: Blueprint;
    techLevel: number;
    energyCost?: number[] | null;
    type: number;
    strength: number;
}
