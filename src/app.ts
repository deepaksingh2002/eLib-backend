import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./books/bookRouter";
import { config } from "./config/config";


const app = express();

app.use(express.json());

app.use(
    cors({
        origin: config.frontendDomain,
    })
);


 // routes
 
app.get('/', (req, res, next) => {
    
    res.json({message: "Welcome on eBook"});
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);


// globle errorHandler

app.use(errorHandler);


export default app;
