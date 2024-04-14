"use strict";
exports.__esModule = true;
exports.TopicData = exports.Topic = void 0;
var Topic = /** @class */ (function () {
    function Topic(name, data) {
        this.name = name;
        this.data = data;
    }
    return Topic;
}());
exports.Topic = Topic;
var TopicData = /** @class */ (function () {
    function TopicData(valid, invalid) {
        this.valid = valid;
        this.invalid = invalid;
    }
    return TopicData;
}());
exports.TopicData = TopicData;
