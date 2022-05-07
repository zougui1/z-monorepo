"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModel = exports.Media = exports.MediaPost = exports.MediaFile = exports.OptimizedImage = exports.MediaTransformation = exports.MediaStatus = exports.MediaType = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const tst_reflect_1 = require("tst-reflect");
const user_1 = require("../user");
const unprocessedMedia_1 = require("../unprocessedMedia");
const core_1 = require("../core");
_ßr.Type.store.set(203, { k: 1, n: "MediaPost", fn: "@zougui/image-downloader.database/src/media/MediaModel.ts:MediaPost#203", props: [{ n: "title", t: _ßr.Type.store.wrap({ n: "string", k: 2, ctor: function () {
                    return Promise.resolve(String);
                } }), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "description", t: _ßr.Type.store.get(257), am: 2, acs: 0, ro: false, o: false }, { n: "file", t: _ßr.Type.store.get(201), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "urls", t: _ßr.Type.store.get(117), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "downloadUrls", t: _ßr.Type.store.get(117), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "tags", t: _ßr.Type.store.get(117), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "species", t: _ßr.Type.store.get(117), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "genders", t: _ßr.Type.store.get(117), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "categories", t: _ßr.Type.store.get(117), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "rating", t: _ßr.Type.store.wrap({ n: "string", k: 2, ctor: function () {
                    return Promise.resolve(String);
                } }), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "authors", t: _ßr.Type.store.get(509), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "publishedAt", t: _ßr.Type.store.get(615), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }, { n: "deletedAt", t: _ßr.Type.store.get(643), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: true }], decs: [{ n: "modelOptions", fn: "@typegoose/typegoose/lib/modelOptions.d.ts:modelOptions#205", args: [null] }], ctors: [{ params: [] }] });
_ßr.Type.store.set(208, { k: 1, n: "Media", fn: "@zougui/image-downloader.database/src/media/MediaModel.ts:Media#208", props: [{ n: "posts", t: _ßr.Type.store.get(227), d: [{ n: "prop", fn: "@typegoose/typegoose/lib/prop.d.ts:prop#85", args: [null] }], am: 2, acs: 0, ro: false, o: false }], decs: [{ n: "modelOptions", fn: "@typegoose/typegoose/lib/modelOptions.d.ts:modelOptions#205", args: [null] }], ctors: [{ params: [] }], ctor: function () {
        return Promise.resolve(require("./MediaModel").Media);
    } });
var MediaType;
(function (MediaType) {
    MediaType["image"] = "image";
    MediaType["story"] = "story";
    MediaType["video"] = "video";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
var MediaStatus;
(function (MediaStatus) {
    MediaStatus["idle"] = "idle";
    MediaStatus["downloading"] = "downloading";
    MediaStatus["success"] = "success";
    MediaStatus["error"] = "error";
})(MediaStatus = exports.MediaStatus || (exports.MediaStatus = {}));
var MediaTransformation;
(function (MediaTransformation) {
    MediaTransformation["resize"] = "resize";
    MediaTransformation["reformat"] = "reformat";
    MediaTransformation["qualityReduction"] = "qualityReduction";
})(MediaTransformation = exports.MediaTransformation || (exports.MediaTransformation = {}));
class OptimizedImage {
}
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], OptimizedImage.prototype, "extension", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], OptimizedImage.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], OptimizedImage.prototype, "size", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, min: 0 }),
    __metadata("design:type", Object)
], OptimizedImage.prototype, "width", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, min: 0 }),
    __metadata("design:type", Object)
], OptimizedImage.prototype, "height", void 0);
__decorate([
    (0, core_1.enumProp)({ enum: MediaTransformation, array: true }),
    __metadata("design:type", Array)
], OptimizedImage.prototype, "transformations", void 0);
exports.OptimizedImage = OptimizedImage;
OptimizedImage.prototype["__reflectedTypeId__"] = 83;
class MediaFile {
}
__decorate([
    (0, typegoose_1.prop)({ trim: true, required: true }),
    __metadata("design:type", String)
], MediaFile.prototype, "originalFileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true, required: true }),
    __metadata("design:type", String)
], MediaFile.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [String], required: true, unique: true }),
    __metadata("design:type", Array)
], MediaFile.prototype, "hashes", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], MediaFile.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], MediaFile.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], MediaFile.prototype, "extension", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], MediaFile.prototype, "size", void 0);
__decorate([
    (0, typegoose_1.prop)({ min: 0, type: Number }),
    __metadata("design:type", Object)
], MediaFile.prototype, "width", void 0);
__decorate([
    (0, typegoose_1.prop)({ min: 0, type: Number }),
    __metadata("design:type", Object)
], MediaFile.prototype, "height", void 0);
exports.MediaFile = MediaFile;
MediaFile.prototype["__reflectedTypeId__"] = 201;
let MediaPost = class MediaPost {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], MediaPost.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: () => MediaFile, _id: false }),
    __metadata("design:type", MediaFile)
], MediaPost.prototype, "file", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true, default: [], type: () => [String] }),
    __metadata("design:type", Array)
], MediaPost.prototype, "urls", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true, type: () => [String] }),
    __metadata("design:type", Array)
], MediaPost.prototype, "downloadUrls", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], MediaPost.prototype, "tags", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], MediaPost.prototype, "species", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], MediaPost.prototype, "genders", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], MediaPost.prototype, "categories", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], MediaPost.prototype, "rating", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [user_1.User], ref: () => user_1.User, required: true }),
    __metadata("design:type", Array)
], MediaPost.prototype, "authors", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Date, default: () => Date.now() }),
    __metadata("design:type", Date)
], MediaPost.prototype, "publishedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Date }),
    __metadata("design:type", Object)
], MediaPost.prototype, "deletedAt", void 0);
MediaPost = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], MediaPost);
exports.MediaPost = MediaPost;
MediaPost.prototype["__reflectedTypeId__"] = 203;
let Media = class Media {
};
__decorate([
    (0, typegoose_1.prop)({
        type: () => [MediaPost],
        default: [],
    }),
    __metadata("design:type", Array)
], Media.prototype, "posts", void 0);
Media = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], Media);
exports.Media = Media;
Media.prototype["__reflectedTypeId__"] = 208;
const type2 = _ßr.Type.store.get(203);
console.time('getType');
const type = _ßr.Type.store.get(208);
console.timeEnd('getType');
console.log('type', type.name);
console.log('type', type2.name);
const profileModel = (model) => {
    const findOne = model.findOne.bind(model);
    model.findOne = (...args) => {
        console.time('findOne');
        console.log(...args);
        return findOne(...args).then((result) => {
            console.timeEnd('findOne');
            return result;
        });
    };
    return model;
};
exports.MediaModel = (0, typegoose_1.getModelForClass)(Media);
// has to be added afterwards as it is using a different schema than typegoose can build
exports.MediaModel.schema.add({
    'posts.description': {
        type: unprocessedMedia_1.DescriptionNodeSchema,
        required: true,
    },
});
//# sourceMappingURL=MediaModel.js.map