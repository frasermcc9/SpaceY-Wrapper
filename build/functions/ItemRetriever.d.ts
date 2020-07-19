import { BaseItem, Base } from "../structures/GameAsset";
export declare function retrieveItem<K extends BaseItem>(itemName: string): Promise<Base<K>>;
