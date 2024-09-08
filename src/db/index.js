import mongoose from "mongoose";

const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
        console.log("mongo db running at host",connectionInstance.connection.host)
    } catch (error) {
        console.log(error)
    }
}


export default connectDb