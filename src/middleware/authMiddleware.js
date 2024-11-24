import express from "express";
import db from "../db.js"; // Update the import path to the correct file
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized(No Token Provided)" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log("decoded ", decoded);
      if (err || !decoded.id) {
        return res.status(401).json({ message: "Unauthorized(Invalid Token)" });
      }
      req.userId = decoded.id;
    });
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
}

export default authMiddleware;
