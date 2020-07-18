"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = exports.Msg = exports.Uri = exports.SkinName = exports.Location = exports.Id = void 0;
class Id extends String {
    constructor(id) {
        super(id);
    }
}
exports.Id = Id;
class Location extends String {
    constructor(location) {
        super(location);
    }
}
exports.Location = Location;
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
