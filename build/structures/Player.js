"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const http_1 = require("http");
const httpRequest_1 = require("../functions/httpRequest");
const ItemRetriever_1 = require("../functions/ItemRetriever");
const Setup_1 = require("../settings/Setup");
class Player {
    constructor(data) {
        Object.assign(this, data);
    }
    //#endregion
    static async create(uId) {
        return new Player(await this.getPlayer(uId));
    }
    async currentLocation() {
        const req = (await httpRequest_1.httpRequest("location/" + this.location));
        if (req.status == "200") {
            return req.data;
        }
        else {
            return Promise.reject("Current location could not be retrieved.");
        }
    }
    async adjacentLocations() {
        return (await this.currentLocation()).adjacent;
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
            cargoString: this.inventory.cargoString,
        };
    }
    get Level() {
        return Player.inverseExpFunction(this.exp);
    }
    get ExpToNextLevel() {
        return Math.ceil(Player.expFunction(this.Level + 1) - this.exp);
    }
    parseForServer() {
        return {
            blueprints: this.blueprints,
            exp: this.exp,
            inventory: this.inventory,
            location: this.location,
            ship: { name: this.ship.name, equipped: this.ship.equipped?.map((a) => a.name) ?? [] },
            skills: this.skills,
            uId: this.uId,
            skin: this.skin,
            skins: this.skins,
        };
    }
    async regionAsteroids() {
        return (await httpRequest_1.httpRequest("location/" + this.location + "/" + this.uId + "/regionasteroids"));
    }
    availableSlots() {
        const returnValue = new Map();
        for (const key in this.ship.availableSlots) {
            const ordinal = Number(key);
            returnValue.set(ordinal, this.ship.availableSlots[ordinal]);
        }
        return returnValue;
    }
    hasBlueprint(item) {
        return this.blueprints.includes(item);
    }
    /**Gets the amount of the given item */
    amountInInventory(item) {
        return (this.inventory.attachments.get(item) ||
            this.inventory.materials.get(item) ||
            this.inventory.reputation.get(item) ||
            this.inventory.ships.get(item) ||
            0);
    }
    //#region private helpers
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
        if (this.skin.skinUri != "") {
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
    //#endregion
    //statics
    static async getPlayer(clientId) {
        const base = (await this.requestPlayer(clientId));
        base.inventory.attachments = new Map(Object.entries(base.inventory.attachments));
        base.inventory.materials = new Map(Object.entries(base.inventory.materials));
        base.inventory.reputation = new Map(Object.entries(base.inventory.reputation));
        base.inventory.ships = new Map(Object.entries(base.inventory.ships));
        return base;
    }
    static async requestPlayer(id) {
        return new Promise((resolve) => {
            let data = "";
            http_1.get(Setup_1.Setup.restUrl + Setup_1.Setup.restPort + "/user/" + id, (res) => {
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    resolve(JSON.parse(data));
                });
            });
        });
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map