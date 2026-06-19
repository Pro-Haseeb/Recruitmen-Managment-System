import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
//....... authorization
import authRoutes from "./routes/authentication/authRoutes.js";

//....... systemadmin
import systemRoutes from "./routes/systemadmin/systemRoutes.js";
import companyRoutes from "./routes/systemadmin/companyRoutes.js";
import userRoutes from "./routes/systemadmin/userRoutes.js";

//....... company_admin
import teamRoutes from "./routes/companyadmin/teamRoutes.js";
import exportActivityRoutes from "./routes/companyadmin/exportActivityRoutes.js";
import interviewRoutes from "./routes/companyadmin/interviewRoutes.js"
//....... HR
import jobRoutes from "./routes/companyadmin/jobRoutes.js";
import detailJobRoute from "./routes/candidate/detailJobRoute.js";

//......... candidate
import applicationRoutes from "./routes/candidate/applicationRoute.js";
import candidateInterviewRoutes from "./routes/candidate/interviewRoutes.js";
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
app.use("/uploads", express.static("uploads"));
// routes

// ........ authorization
app.use("/api/auth", authRoutes);

// ........ system admin
app.use("/api/system", systemRoutes);
app.use("/api/system", companyRoutes);
app.use("/api/system/users", userRoutes);

// ........ company_admin
app.use("/api/company", teamRoutes);
app.use("/api/company", exportActivityRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", detailJobRoute);
app.use("/api/interview", interviewRoutes);

//........ candidate
app.use("/api/application", applicationRoutes);
app.use("/api/candidate/interviews", candidateInterviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});