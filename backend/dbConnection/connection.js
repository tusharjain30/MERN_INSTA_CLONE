import mongoose from "mongoose";

const connection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_INSTAGRAM_CLONE"
    }).then(() => {
        console.log("Database is Connected!")
    }).catch((err) =>{
        console.log(`some error occurred while connecting to database! -> ${err}`)
    })
};

export default connection;