"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var findSubmissionPage = function () {
    return document.getElementById('submission_page');
};
var findDownloadButton = function () {
    var container = findSubmissionPage();
    if (!container) {
        return;
    }
    var linkButtons = container.querySelectorAll('a.button');
    var downloadLink = Array
        .from(linkButtons)
        .find(function (link) { var _a; return ((_a = link.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'download'; });
    return downloadLink;
};
var getSubmissionUrl = function () {
    var _a;
    var downloadButton = findDownloadButton();
    if (!downloadButton) {
        return;
    }
    var _b = window.location, origin = _b.origin, pathname = _b.pathname;
    var url = origin + pathname;
    var downloadUrl = (_a = downloadButton.attributes.getNamedItem('href')) === null || _a === void 0 ? void 0 : _a.value;
    var cleanDownloadUrl = downloadUrl && !downloadUrl.startsWith('http')
        ? encodeURI("https:".concat(downloadUrl))
        : downloadUrl;
    return {
        url: url,
        downloadUrl: cleanDownloadUrl,
    };
};
var getSubmissionSidebar = function () {
    return document.querySelector('.submission-sidebar');
};
var getSubmissionTags = function () {
    var _a, _b;
    var tags = (_b = (_a = getSubmissionSidebar()) === null || _a === void 0 ? void 0 : _a.querySelector('.tags-row')) === null || _b === void 0 ? void 0 : _b.getElementsByClassName('tags');
    if (!tags) {
        return [];
    }
    var tagsText = Array.from(tags).map(function (tag) { return tag.textContent; }).filter(Boolean);
    return tagsText;
};
var getSubmissionInfo = function () {
    var _a, _b, _c, _d, _e;
    var infoSection = (_a = getSubmissionSidebar()) === null || _a === void 0 ? void 0 : _a.querySelector('.info');
    if (!infoSection) {
        return {};
    }
    var _f = Array.from(infoSection.children), categoryRow = _f[0], speciesRow = _f[1], genderRow = _f[2];
    var submissionType = (_b = categoryRow === null || categoryRow === void 0 ? void 0 : categoryRow.querySelector('.category-name')) === null || _b === void 0 ? void 0 : _b.textContent;
    var category = (_c = categoryRow === null || categoryRow === void 0 ? void 0 : categoryRow.querySelector('.type-name')) === null || _c === void 0 ? void 0 : _c.textContent;
    var species = (_d = speciesRow === null || speciesRow === void 0 ? void 0 : speciesRow.querySelector('span')) === null || _d === void 0 ? void 0 : _d.textContent;
    var gender = (_e = genderRow === null || genderRow === void 0 ? void 0 : genderRow.querySelector('span')) === null || _e === void 0 ? void 0 : _e.textContent;
    return {
        submissionType: submissionType,
        category: category,
        species: [species],
        genders: [gender],
    };
};
var Ratings;
(function (Ratings) {
    Ratings["general"] = "SFW";
    Ratings["mature"] = "NSFW";
    Ratings["adult"] = "NSFW";
})(Ratings || (Ratings = {}));
var getSubmissionRating = function () {
    var _a, _b, _c;
    var ratingElement = (_b = (_a = getSubmissionSidebar()) === null || _a === void 0 ? void 0 : _a.querySelector('.rating')) === null || _b === void 0 ? void 0 : _b.querySelector('.rating-box');
    var rating = (_c = ratingElement === null || ratingElement === void 0 ? void 0 : ratingElement.textContent) === null || _c === void 0 ? void 0 : _c.toLowerCase().trim();
    return Ratings[rating || ''];
};
var getSubmissionDescriptors = function () {
    var _a, _b, _c, _d, _e, _f, _g;
    var page = findSubmissionPage();
    if (!page) {
        return {};
    }
    var title = (_b = (_a = page.querySelector('.submission-title')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/^\n/, '').trim();
    var descriptionElement = page.querySelector('.submission-description');
    var description = ((_c = descriptionElement === null || descriptionElement === void 0 ? void 0 : descriptionElement.textContent) === null || _c === void 0 ? void 0 : _c.replace(/^\n/, '').trimLeft()) || '';
    var descriptionNodes = [];
    var childNodes = Array.from((descriptionElement === null || descriptionElement === void 0 ? void 0 : descriptionElement.childNodes) || []);
    var children = Array.from((descriptionElement === null || descriptionElement === void 0 ? void 0 : descriptionElement.children) || []);
    var elementIndex = 0;
    for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
        var node = childNodes_1[_i];
        var childElement = children[elementIndex];
        var nodeName = node.nodeName.toLowerCase();
        switch (nodeName) {
            case '#text':
                descriptionNodes.push({
                    type: 'text',
                    text: node.textContent || '',
                });
                break;
            case 'br':
                elementIndex++;
                descriptionNodes.push({
                    type: 'text',
                    text: '\n',
                });
                break;
            case 'a': {
                elementIndex++;
                if (!childElement) {
                    break;
                }
                var img = Array.from(childElement.children).find(function (node) { return node.nodeName.toLowerCase() === 'img'; });
                var href = (_d = childElement.attributes.getNamedItem('href')) === null || _d === void 0 ? void 0 : _d.value;
                var linkElement = {
                    type: 'link',
                    href: href,
                    text: node.textContent || '',
                };
                if (img) {
                    var src = (_e = img.attributes.getNamedItem('src')) === null || _e === void 0 ? void 0 : _e.value;
                    var alt = (_f = img.attributes.getNamedItem('alt')) === null || _f === void 0 ? void 0 : _f.value;
                    var title_1 = (_g = img.attributes.getNamedItem('title')) === null || _g === void 0 ? void 0 : _g.value;
                    descriptionNodes.push(__assign(__assign({}, linkElement), { src: src, alt: alt, title: title_1 }));
                }
                else {
                    console.log('link does not have img');
                    descriptionNodes.push(linkElement);
                }
                break;
            }
            default:
                descriptionNodes.push({ type: 'unknown', text: node.textContent || '' });
                console.log('unhandled node type:', nodeName);
                break;
        }
    }
    if (descriptionNodes[0]) {
        descriptionNodes[0].text = descriptionNodes[0].text.replace(/^\n/, '').trimLeft();
    }
    return {
        title: title,
        description: description,
        descriptionNodes: descriptionNodes,
    };
};
var getAuthor = function () {
    var _a, _b;
    var link = (_b = (_a = findSubmissionPage()) === null || _a === void 0 ? void 0 : _a.querySelector('.submission-id-sub-container')) === null || _b === void 0 ? void 0 : _b.querySelector('a');
    if (!link) {
        return {};
    }
    var profileUrl = link.href || '';
    var name = link.textContent || '';
    return {
        name: name,
        profileUrl: profileUrl,
    };
};
var getPublishDate = function () {
    var _a, _b, _c;
    var dateElement = (_b = (_a = findSubmissionPage()) === null || _a === void 0 ? void 0 : _a.querySelector('.submission-id-sub-container')) === null || _b === void 0 ? void 0 : _b.querySelector('.popup_date');
    var dateString = (_c = dateElement === null || dateElement === void 0 ? void 0 : dateElement.attributes.getNamedItem('title')) === null || _c === void 0 ? void 0 : _c.value;
    if (!dateString) {
        return;
    }
    return new Date(dateString);
};
var getSubmissionData = function () {
    var tags = getSubmissionTags();
    var submissionUrl = getSubmissionUrl();
    var info = getSubmissionInfo();
    var descriptors = getSubmissionDescriptors();
    var author = getAuthor();
    var publishedAt = getPublishDate();
    var rating = getSubmissionRating();
    return __assign(__assign(__assign(__assign({}, info), submissionUrl), descriptors), { publishedAt: publishedAt, author: author, tags: tags, rating: rating });
};
var runContentScript = function () { return __awaiter(void 0, void 0, void 0, function () {
    var submission;
    return __generator(this, function (_a) {
        submission = getSubmissionData();
        if (!submission) {
            console.log('Submission URL not found.');
            return [2 /*return*/];
        }
        // either send to the background of the extension (unecessary)
        // or POST into a server which will process it
        browser.runtime.sendMessage(JSON.stringify({
            type: 'FA:submission',
            payload: {
                submission: submission
            },
        }));
        return [2 /*return*/];
    });
}); };
runContentScript()
    .catch(function (error) {
    console.error('Content script error:', error);
});
//# sourceMappingURL=index.js.map