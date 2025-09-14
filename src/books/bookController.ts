import { NextFunction, Request, Response } from "express";
import fs from "node:fs"
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authantacte";


const createBook = async (req: Request, res: Response, next: NextFunction) => {

    const { title, genre} = req.body;
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files.coverImage || !files.file) {
      return res.status(400).json({ error: "Cover image and book file required" });
    }

    // Cover image upload
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").slice(-1)[0];
    const coverFileName = files.coverImage[0].filename;
    const coverFilePath = path.resolve("public/data/uploads", coverFileName);

    const uploadResult = await cloudinary.uploader.upload(coverFilePath, {
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
        genre,
        author: _req.userId,
        coverImage: uploadResult.secure_url,
        file: bookFileName
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

export default createBook;
