import express from "express";
import { env } from "./common/env";
import chalk from "chalk";
import { userRoutes } from "./modules/users";
import { authRoutes } from "./modules/auth";
import { healthRoute } from "./modules/health";
import cors from "cors";
import cookieParser from "cookie-parser";
import { movieRoutes } from "./modules/movies";
import { movieMarkRoutes } from "./modules/movieMarks";
import { genreRoutes } from "./modules/genres";
import { actorsRoutes } from "./modules/actors";

export let readyNum = 0;
export const app = express();

const { PORT } = env;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/movies", movieMarkRoutes);
app.use("/genres", genreRoutes);
app.use("/actors", actorsRoutes);
app.use(healthRoute);

app.listen(PORT, () => {
  readyNum = Date.now();
  console.log(chalk.redBright(`Rewind API running on ${env.PORT}`));
});
