import { Request, Response } from "express";
import Todo, { ITodo } from "../model/todo.model";
import User, { IUser } from "../model/user.model";
import { Types } from "mongoose";
import { validationResult } from "express-validator";
import { todo } from "node:test";

// create todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
    const { title, description }: { title: string; description: string } =
      req.body;

    const todo: ITodo | null = await Todo.create({
      title,
      description,
    });

    const user_id = req.user?._id;
    const user = await User.findOne({ _id: user_id });

    if (user && todo) {
      user.todo?.push(todo._id as Types.ObjectId); 
      await user.save();
      return res.status(201).json({ message: "Todo created successfully!", todo });
    } else {
      return res.status(404).json({ message: "User or Todo not found" });
    }
  } catch (error) {
    console.log("error in create-todo endpoint", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update todo
export const updateTodo = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const user_id = req.user?._id;
        const user = await User.findOne({ _id: user_id });

        if(user && user?.todo?.includes(new Types.ObjectId(id))){
            const updatedTodo = await Todo.findByIdAndUpdate(id, { completed: true }, { new: true });
            return res.status(200).json({message: "Todo updated successfully", updatedTodo});
        }
        return res.status(401).json({message: "You don't have permission to delete this."});
    } catch (error) {
        console.log("error in update-todo endpoint", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// delete todo
export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const user_id = req.user?._id;
        const user = await User.findOne({ _id: user_id });

        if(user && user?.todo?.includes(new Types.ObjectId(id))){
            // removing id from user todo list
            user.todo = user.todo.filter(todoId => todoId.toString() !== id);
            await user.save();

            const deletedTodo = await Todo.findByIdAndDelete(id);
            return res.status(200).json({message: "Todo deleted successfully", deletedTodo});
        }
        return res.status(401).json({message: "You don't have permission to delete this."});
    } catch (error) {
        console.log("error in delete-todo endpoint", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}