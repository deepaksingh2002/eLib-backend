import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    // db Call
    const User = await userModel.findOne({email});
    if(User) {
        const error= createHttpError(400, "User already existed!")
        next(error);
    }


     res.json({message: "User Created"});
}

export {createUser}