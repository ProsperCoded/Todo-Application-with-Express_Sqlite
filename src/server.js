import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./route/authRoutes.js";
import todosRouter from "./route/todosRouter.js";
const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
// expect json
app.use(express.json());
app.use("/auth", authRouter);
app.use("/todos", todosRouter);

app.use(express.static(path.join(__dirname, "../public")));
const htmlFile = path.join(__dirname, "public", "index.html");
console.log(htmlFile);
app.get("/", (req, res) => {
  return res.sendFile(htmlFile);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
