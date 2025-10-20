import mongoose from "mongoose";

const connectdb = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.log(`There was a problem while connecting to the database: ${error}`);

    }

}

export default connectdb