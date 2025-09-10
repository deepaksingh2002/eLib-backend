import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";
import { config } from "../config/config";

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

    // password hash

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword
    })


    // Token generation -jwt
    const token = sign({sub: newUser._id}, config.jwtSecret as string, {
        expiresIn: '7d',
        algorithm: "HS256"
        })

     res.json({ accessToken: token});
}

export {createUser}