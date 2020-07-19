import { httpRequest } from "./httpRequest";
import { BaseItem, Base } from "../structures/GameAsset";

export function retrieveItem<K extends BaseItem>(itemName: string): Promise<Base<K>> {
    return (httpRequest("item/" + itemName) as unknown) as Promise<Base<K>>;
}
