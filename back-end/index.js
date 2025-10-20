import express from "express"
import connectdb from "./utils/connectdb.js"

const PORT = process.env.PORT
const app = express()

app.listen(PORT, () => {
    connectdb()
    console.log(`Server is running on port ${PORT}`);

})