import express from "express"
import connectdb from "./utils/connectdb.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors";


const PORT = process.env.PORT

const app = express()
app.use(cors({
  origin: "http://localhost:3000", // demo url 
  credentials: true,              
}));

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authRoutes)

app.listen(PORT, () => {
    connectdb()
    console.log(`Server is running on port ${PORT}`);

})