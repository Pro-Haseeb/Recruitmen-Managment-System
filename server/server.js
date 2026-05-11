import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
//....... authorization
import authRoutes from "./routes/authentication/authRoutes.js";

//....... systemadmin
import systemRoutes from "./routes/systemadmin/systemRoutes.js";
import companyRoutes from "./routes/systemadmin/companyRoutes.js";

//....... company_admin
import teamRoutes from "./routes/companyadmin/teamRoutes.js";

//....... HR
import jobRoutes from "./routes/companyadmin/jobRoutes.js";
dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// routes

// ........ authorization
app.use("/api/auth", authRoutes);

// ........ system admin
app.use("/api/system", systemRoutes);
app.use("/api/system", companyRoutes);

// ........ company_admin
app.use("/api/company", teamRoutes);
app.use("/api/jobs", jobRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});