import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
    title: String;
    description: String;
    completed?: String
}

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;