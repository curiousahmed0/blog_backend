import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/index.js"
import logger from "./utils/logger.js"
import morgan from "morgan"
import userRouter from "./routes/userRoutes.js"

dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 7000
const app = express()
app.use(express.json())
app.use("/uploads",express.static("uploads"))


connectDb().then(
app.listen(port,()=>{
    console.log(`app is running at port ${port}`)
})
).catch(err=>console.log(err))


const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

app.use("/api/v1/user",userRouter)



 


// logger.info("This is an info message");
// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.debug("This is a debug message");