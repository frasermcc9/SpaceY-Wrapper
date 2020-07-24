import { WarpPower } from "./Constants";

export interface AdjacentLocation {
    name: string;
    warpStrength: WarpPower;
    techLevel: number;
    image: string | undefined;
}
