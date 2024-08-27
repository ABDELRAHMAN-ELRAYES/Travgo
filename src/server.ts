import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB: string = process.env.DATABASE_LOCAL as string;

mongoose.connect(DB).then(() => {
  console.log("DB is connected successfully");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`[server] is listening at port ${port}`);
});
