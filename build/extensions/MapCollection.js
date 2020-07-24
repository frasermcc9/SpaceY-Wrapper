"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCollection = void 0;
class MapCollection extends Map {
    set(key, value) {
        this._array = null;
        this._keyArray = null;
        return super.set(key, value);
    }
    delete(key) {
        this._array = null;
        this._keyArray = null;
        return super.delete(key);
    }
    random(amount) {
        let arr = this.array();
        if (typeof amount === "undefined")
            return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || !amount)
            return [];
        arr = arr.slice();
        return Array.from({ length: amount }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    randomKey(amount) {
        let arr = this.keyArray();
        if (typeof amount === "undefined")
            return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || !amount)
            return [];
        arr = arr.slice();
        return Array.from({ length: amount }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    /**
     * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.values()]` or
     * `Array.from(collection.values())` instead.
     * @returns {Array}
     */
    array() {
        if (!this._array || this._array.length !== this.size)
            this._array = [...this.values()];
        return this._array;
    }
    /**
     * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
     * `Array.from(collection.keys())` instead.
     * @returns {Array}
     */
    keyArray() {
        if (!this._keyArray || this._keyArray.length !== this.size)
            this._keyArray = [...this.keys()];
        return this._keyArray;
    }
    map(fn, thisArg) {
        if (typeof thisArg !== "undefined")
            fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }
    filter(fn, thisArg) {
        if (typeof thisArg !== "undefined")
            fn = fn.bind(thisArg);
        const results = new MapCollection();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
}
exports.MapCollection = MapCollection;
//# sourceMappingURL=MapCollection.js.map