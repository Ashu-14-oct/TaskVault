"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoDB = mongoose_1.default.connect('mongodb://localhost:27017/todo')
    .then(() => console.log("Connected to the mongodb"))
    .catch((err) => {
    console.log(err);
});
exports.default = mongoDB;
