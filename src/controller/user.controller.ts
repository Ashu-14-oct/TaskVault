import { Request, Response } from "express";
import User from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// user sigm up
export const signUp = async (req: Request, res: Response) => {
  try {
    // passing req to express validator middleware for validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // check if user already present in our db
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return res.status(409).json({
        message: "User with this mail already exist, try different mail.",
      });
    }

    // hashing password before creating account
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // creating jwt token for logged in user
    const accessToken = await jwt.sign({ _id: user.id }, "jwtkeyexample", {
      expiresIn: "15m",
    });
    const refreshToken = await jwt.sign({ _id: user.id }, "jwtkeyexample", {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    const newUser = {
      name: user.name,
      email: user.email,
    };

    return res
      .status(201)
      .json({ message: "Signed up successfully!", newUser });
  } catch (error) {
    console.log("error in sign-up endpoint", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// log in
export const logIn = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email is incorrect" });
    }

    // comparing hashed password with original password using bcrypt
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // creating jwt token for logged in user
    const accessToken = await jwt.sign({ _id: user.id }, "jwtkeyexample", {
      expiresIn: "15m",
    });
    const refreshToken = await jwt.sign({ _id: user.id }, "jwtkeyexample", {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res
      .status(200)
      .json({ message: "Logged in successfully", accessToken });
  } catch (error) {
    console.log("error in log-in endpoint", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// jwt token refresh
export const tokenRefresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, "jwtkeyexample");
    const userId = (decoded as { _id: string })._id;

    const accessToken = jwt.sign({ userId }, "jwtkeyexample", {
      expiresIn: "15m",
    });
    res.cookie("accessToken", accessToken, { httpOnly: true });

    return res.json({ message: "Token refreshed", accessToken });
  } catch (error) {
    console.log("error in log-in endpoint", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
