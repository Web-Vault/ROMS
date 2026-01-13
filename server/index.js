import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import managerRoutes from "./routes/managerRoutes.js";
import menuRoutes from "./routes/menu.js";
import tablesRoutes from "./routes/tables.js";
import ordersRoutes from "./routes/orders.js";
import settingsRoutes from "./routes/settings.js";
import metricsRoutes from "./routes/metrics.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import morgan from "morgan";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/manager", managerRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tablesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/metrics", metricsRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
