export declare class MapCollection<K, V> extends Map<K, V> {
    private _array;
    private _keyArray;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    /**
     * Obtains unique random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of values to obtain randomly
     * @returns {*|Array<*>} A single value if no amount is provided or an array of values
     */
    random(): V;
    random(amount: number): V[];
    /**
     * Obtains unique random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of keys to obtain randomly
     * @returns {*|Array<*>} A single key if no amount is provided or an array
     */
    randomKey(): K;
    randomKey(amount: number): K[];
    /**
     * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.values()]` or
     * `Array.from(collection.values())` instead.
     * @returns {Array}
     */
    array(): V[];
    /**
     * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
     * `Array.from(collection.keys())` instead.
     * @returns {Array}
     */
    keyArray(): K[];
    /**
     * Maps each item to another value into an array. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new array, taking three arguments
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Array}
     * @example collection.map(user => user.tag);
     */
    map<T>(fn: (value: V, key: K, collection: this) => T): T[];
    map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
    filter(fn: (value: V, key: K, collection: this) => boolean): this;
    filter<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): this;
}
