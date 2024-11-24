import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });
  res.status(201);
  // Logic to get user profile
  const hashedPassword = bcrypt.hashSync(password.toString(), 10);
  console.log("hashedPassword", hashedPassword);
  try {
    // Prepare insert query for user into the database
    const insertUserQuery = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    // set the exact values for the columns stated in insertUserQuery
    const users = insertUserQuery.run(username, hashedPassword);

    // create a default todo
    const defaultTodo = "Hello :), Insert your first todo";
    const insertTodoQuery = db.prepare(
      "INSERT INTO todos (user_id, task) VALUES (?, ?)"
    );
    insertTodoQuery.run(users.lastInsertRowid, defaultTodo);

    // create user token
    const token = jwt.sign(
      { id: users.lastInsertRowid },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return res.json({ message: "User created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in creating user", error: err });
  }
});

router.post("/login", (req, res) => {
  // Logic to handle user login
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid username or password" });
  }
  try {
    const getUserQuery = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = getUserQuery.get(username);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Invalid username or password" });
    }
    // validate password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }
    console.log({ user });
    // create user token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.json({ message: "Login Successful", token });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error in logging in", error });
  }
});

router.post("/logout", (req, res) => {
  // Logic to handle user logout
  res.json({ message: "User logged out" });
});

export default router;
