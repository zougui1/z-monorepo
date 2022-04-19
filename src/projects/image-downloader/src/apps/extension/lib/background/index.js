"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var runBackgroundScript = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //const tabs = await browser.tabs.query({});
        //console.log('tabs', tabs);
        //await uploadImage2();
        browser.runtime.onMessage.addListener(function (message) {
            var event = JSON.parse(message);
            var action = actions[event.type];
            if (!action) {
                console.log("No action registered for \"".concat(event.type, "\""));
                return;
            }
            action(event.payload);
        });
        return [2 /*return*/];
    });
}); };
var actions = {
    'FA:submission': function (_a) {
        var submission = _a.submission;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, uploadSubmission(submission)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
};
runBackgroundScript()
    .catch(function (error) {
    console.error('Background script error:', error);
});
function uploadSubmission(submission) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('http://localhost:3000/api/v1/media', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(submission)
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function uploadImage2() {
    return __awaiter(this, void 0, void 0, function () {
        var siranor, dradmon, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    siranor = {
                        name: 'Siranor',
                        profileUrls: ['https://furaffinity.net/user/siranor', 'https://siranor.sofurry.com/'],
                    };
                    dradmon = {
                        name: 'Dradmon',
                        profileUrls: ['https://furaffinity.net/user/dradmon'],
                    };
                    body = {
                        type: 'image',
                        fileName: 'some-dragon',
                        extension: 'jpg',
                        urls: ['https://furaffinity.net/view/1215415', 'https://e621.net/posts/5415184'],
                        hash: 'some hash',
                        tags: ['dragon', 'SFW'],
                        authors: [siranor, dradmon],
                        title: 'Cuddling dragons',
                        description: 'Some dragons cuddling.',
                        variants: [
                            {
                                type: 'image',
                                fileName: 'some-dragon (NSFW)',
                                title: 'Naughty dragons',
                                description: 'Some dragons doing what dragons do best.',
                                extension: 'jpg',
                                hash: 'some hash',
                                urls: ['https://furaffinity.net/view/1215416', 'https://e621.net/posts/5415185'],
                                tags: ['dragon', 'NSFW'],
                                authors: [siranor, dradmon],
                            },
                            {
                                type: 'image',
                                fileName: 'some-dragon (cum)',
                                title: 'Messy dragons',
                                description: 'Some dragons just did what dragons do best.',
                                extension: 'jpg',
                                hash: 'some hash',
                                urls: ['https://furaffinity.net/view/1215417', 'https://e621.net/posts/5415186'],
                                tags: ['dragon', 'NSFW', 'cum'],
                                authors: [siranor, dradmon],
                            }
                        ],
                    };
                    // setup the HTTP request to get ddg results
                    /*let xhr = new XMLHttpRequest();
                  
                    xhr.onload = function () {
                      console.log('onload');
                    };
                  
                    xhr.onerror = function (e) {
                      console.log('An error occurred', e);
                    }
                  
                    // open and send the request.
                    xhr.open('POST', 'http://localhost:3000/api/v1/media', true);
                    xhr.responseType = 'json';
                    xhr.send(JSON.stringify(body));*/
                    return [4 /*yield*/, fetch('http://localhost:3000/api/v1/media', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify(body)
                        })];
                case 1:
                    // setup the HTTP request to get ddg results
                    /*let xhr = new XMLHttpRequest();
                  
                    xhr.onload = function () {
                      console.log('onload');
                    };
                  
                    xhr.onerror = function (e) {
                      console.log('An error occurred', e);
                    }
                  
                    // open and send the request.
                    xhr.open('POST', 'http://localhost:3000/api/v1/media', true);
                    xhr.responseType = 'json';
                    xhr.send(JSON.stringify(body));*/
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=index.js.map