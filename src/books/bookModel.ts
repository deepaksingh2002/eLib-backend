
import mongoose, { Schema } from "mongoose";
import { Book } from "./bookTypes";
//import userModel from "../user/userModel";



const bookSchema = new Schema<Book>({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        //ref: userModel,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    file: { 
        type: String,
        required: true
    
    },
    genre: {
        type: String, 
        required: true
    }
},{timestamps: true})


export default mongoose.model<Book>("Book", bookSchema)