import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    // db Call
  try {
      const User = await userModel.findOne({email});
      if(User) {
          const error= createHttpError(400, "User already existed with this email!")
          next(error);
      }
  } catch (err) {
    return next(createHttpError(500, "Error while gatting user"))
  }

    // password hash
    let newUser: User

try {
        const hashedPassword = await bcrypt.hash(password, 10);
    
            newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })
    
} catch (err) {
    return next(createHttpError(500, "Error while creating user."))
}

try {
        // Token generation -jwt
        const token = sign({sub: newUser._id}, config.jwtSecret as string, {
            expiresIn: '7d',
            algorithm: "HS256"
            })
    
         res.json({ accessToken: token});
} catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"))
}
};

const loginUser = async(req: Request, res: Response, next: NextFunction) => {

    const {email, password} = req.body;

    if(!email || !password){
        const error = createHttpError(400, "All fields are required!");
        return next(error);
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            const error = createHttpError(404, "User not found");
            return next(error);
        }
    
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return next(createHttpError(400, "email or password incorrect."));
        }

   
        const token = sign({sub: user._id}, config.jwtSecret as string, {
            expiresIn: "7d", 
            algorithm: "HS256"
        })
        res.json(
            {
                accesToken: token
            }
        )
    } catch (err) {
        return next(createHttpError(500, "Error while signing the jwt token"))
    }
};



export {createUser, loginUser}