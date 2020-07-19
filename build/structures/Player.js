"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const httpRequest_1 = require("../functions/httpRequest");
const ItemRetriever_1 = require("../functions/ItemRetriever");
class Player {
    //#endregion
    constructor(data) {
        Object.assign(this, data);
    }
    async currentLocation() {
        return (await httpRequest_1.httpRequest("location/" + this.location));
    }
    async adjacentLocations() {
        return (await httpRequest_1.httpRequest("user/" + this.uId + "/adjacent"));
    }
    async profile() {
        return {
            credits: this.inventory.credits,
            tokens: this.inventory.tokens,
            skills: this.skills,
            image: await this.playerImage(),
            bestFaction: await this.bestFaction(),
            ship: this.ship,
            level: this.Level,
            location: this.location,
            exp: this.exp,
            expToNext: this.ExpToNextLevel,
        };
    }
    get Level() {
        return Player.inverseExpFunction(this.exp);
    }
    get ExpToNextLevel() {
        return Math.ceil(Player.expFunction(this.Level + 1) - this.exp);
    }
    /**
     * Returns cumulative xp required to reach a level
     * @param x the level
     * @returns the cumulative xp to reach this level
     */
    static expFunction(x) {
        return (5 / 9) * (x + 1) * (4 * x ** 2 - 4 * x + 27);
    }
    /**
     * Returns the level that a player with xp *x* would be
     * @param x the cumulative xp of the player
     * @returns the level that the player would be
     */
    static inverseExpFunction(x) {
        for (let i = 0;; i++) {
            if (this.expFunction(i) > x) {
                return i - 1;
            }
        }
    }
    async playerImage() {
        if (this.skin != undefined) {
            return this.skin.skinUri;
        }
        else {
            const ship = await ItemRetriever_1.retrieveItem(this.ship.name);
            if (ship.status == "200") {
                return ship.item.imageUri;
            }
            else {
                throw new TypeError(`Could not GET ship '${this.ship.name}'.`);
            }
        }
    }
    async bestFaction() {
        let bestFaction = "", bestValue = -Infinity;
        this.inventory.reputation.forEach((val, fac) => {
            if (val > bestValue)
                bestFaction = fac;
        });
        const returnValue = await ItemRetriever_1.retrieveItem(bestFaction);
        if (returnValue.status == "200") {
            return returnValue.item;
        }
        else {
            throw new TypeError(`Could not GET faction '${bestFaction}'.`);
        }
    }
}
exports.Player = Player;
