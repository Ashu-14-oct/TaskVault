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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = void 0;
const todo_model_1 = __importDefault(require("../model/todo.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const mongoose_1 = require("mongoose");
const express_validator_1 = require("express-validator");
// create todo
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description } = req.body;
        const todo = yield todo_model_1.default.create({
            title,
            description,
        });
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_model_1.default.findOne({ _id: user_id });
        if (user && todo) {
            (_b = user.todo) === null || _b === void 0 ? void 0 : _b.push(todo._id);
            yield user.save();
            return res.status(201).json({ message: "Todo created successfully!", todo });
        }
        else {
            return res.status(404).json({ message: "User or Todo not found" });
        }
    }
    catch (error) {
        console.log("error in create-todo endpoint", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createTodo = createTodo;
// update todo
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { id } = req.params;
        const user_id = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const user = yield user_model_1.default.findOne({ _id: user_id });
        if (user && ((_d = user === null || user === void 0 ? void 0 : user.todo) === null || _d === void 0 ? void 0 : _d.includes(new mongoose_1.Types.ObjectId(id)))) {
            const updatedTodo = yield todo_model_1.default.findByIdAndUpdate(id, { completed: true }, { new: true });
            return res.status(200).json({ message: "Todo updated successfully", updatedTodo });
        }
        return res.status(401).json({ message: "You don't have permission to delete this." });
    }
    catch (error) {
        console.log("error in update-todo endpoint", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateTodo = updateTodo;
// delete todo
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const { id } = req.params;
        const user_id = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        const user = yield user_model_1.default.findOne({ _id: user_id });
        if (user && ((_f = user === null || user === void 0 ? void 0 : user.todo) === null || _f === void 0 ? void 0 : _f.includes(new mongoose_1.Types.ObjectId(id)))) {
            // removing id from user todo list
            user.todo = user.todo.filter(todoId => todoId.toString() !== id);
            yield user.save();
            const deletedTodo = yield todo_model_1.default.findByIdAndDelete(id);
            return res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
        }
        return res.status(401).json({ message: "You don't have permission to delete this." });
    }
    catch (error) {
        console.log("error in delete-todo endpoint", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteTodo = deleteTodo;
