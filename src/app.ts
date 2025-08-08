import express from "express";

import errorHandler from "./middlewares/errorHandler";



const app = express()

// routes

// Http methods GET, POST PUT PATCH DELETE

app.get('/', (req, res, next) => {
    
    res.json({message:"Welcome on eBook"})
})


// globle error handler

app.use(errorHandler)


export default app
