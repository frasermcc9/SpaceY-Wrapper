"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = exports.Msg = exports.Quantity = exports.ItemName = exports.StoreName = exports.AsteroidName = exports.Uri = exports.SkinName = exports.LocationName = exports.Id = void 0;
class Id extends String {
    constructor(id) {
        super(id);
    }
}
exports.Id = Id;
class LocationName extends String {
    constructor(location) {
        super(location);
    }
}
exports.LocationName = LocationName;
class SkinName extends String {
    constructor(skinName) {
        super(skinName);
    }
}
exports.SkinName = SkinName;
class Uri extends String {
    constructor(uri) {
        super(uri);
    }
}
exports.Uri = Uri;
class AsteroidName extends String {
    constructor(name) {
        super(name);
    }
}
exports.AsteroidName = AsteroidName;
class StoreName extends String {
    constructor(name) {
        super(name);
    }
}
exports.StoreName = StoreName;
class ItemName extends String {
    constructor(name) {
        super(name);
    }
}
exports.ItemName = ItemName;
class Quantity extends Number {
    constructor(quantity) {
        super(quantity);
    }
}
exports.Quantity = Quantity;
class Msg extends String {
    constructor(msg) {
        super(msg);
    }
}
exports.Msg = Msg;
class Result extends Boolean {
    constructor(code) {
        super(code);
    }
}
exports.Result = Result;
