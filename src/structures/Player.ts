export interface Player extends PlayerBase {
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
    ship: {
        name: string;
        equipped: string[];
    };
    skin?: { skinUri: string; skinName: string };
    skins?: { skinUri: string; skinName: string }[];
    location: string;
    blueprints: string[];
    exp: number;
    skills: [number, number, number];
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
