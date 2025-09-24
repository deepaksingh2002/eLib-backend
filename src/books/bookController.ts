import { NextFunction, Request, Response } from "express";
import fs from "node:fs"
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authantacte";



const createBook = async (req: Request, res: Response, next: NextFunction) => {

    const { title, discription, genre} = req.body;
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files.coverImage || !files.file) {
      return res.status(400).json({ error: "Cover image and book file required" });
    }

    // Cover image upload
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").slice(-1)[0];
    const coverFileName = files.coverImage[0].filename;
    const coverFilePath = path.resolve("public/data/uploads", coverFileName);

    const bookCoverUploadResult = await cloudinary.uploader.upload(coverFilePath, {
      filename_override: coverFileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // Book file upload (PDF)
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve("public/data/uploads", bookFileName);

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
        title,
        discription,
        genre,
        author: _req.userId,
        coverImage: bookCoverUploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
    });

    // Delete temp files
    await fs.promises.unlink(coverFilePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({
      id: newBook._id
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error while uploading the files"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const {title, genre} = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({_id: bookId});
  if(!book){
    return next(createHttpError(404, "Book not found"));
  }

  const _req = req as AuthRequest;
  if(book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthorized access to bookUpdate."))
  }



try {
    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    let completeCoverImage = "";
    if(files?.coverImage){
      const filename = files.coverImage[0].filename;
      const coverMimeType = files.coverImage[0].mimetype.split("/").slice(-1)[1];  // ADD IN UTILITY FILE
  
      const filePath = path.resolve(
        __dirname, "../../public/data/uploads", filename
      );
  
      completeCoverImage = filename;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverMimeType
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);

    }


    // fileUpdate

  let completeFileName = "";
  if (files.file) {
  
    const bookFilePath = path.resolve(
      __dirname, "../../public/data/uploads", files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf"
      
    });
    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);

  }


  const updatedBook  = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },{
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },{new: true}
  );

  res.json(updatedBook );

  } catch (err) {
    return next(createHttpError(500, 'Error while updating coverImage or file'))
  }

}


export  {createBook, updateBook};
