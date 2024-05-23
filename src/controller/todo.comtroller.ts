import { Request, Response } from "express";
import Todo, { ITodo } from "../model/todo.model";
import User, { IUser } from "../model/user.model";
import { Types } from "mongoose";
import { validationResult } from "express-validator";

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
