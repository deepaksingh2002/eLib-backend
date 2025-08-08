import express from "express";

import errorHandler from "./middlewares/errorHandler";
import userRouter from "./user/userRouter";


const app = express();

app.use(express.json());

// routes


app.get('/', (req, res, next) => {
    
    res.json({message:"Welcome on eBook"});
});

app.use("/api/v1/users", userRouter);


// globle errorHandler

app.use(errorHandler);


export default app;
