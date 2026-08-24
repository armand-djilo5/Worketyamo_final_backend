import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.config.js'
import { v4 as uuidv4 } from 'uuid'
import HttpCode from '../core/constants/index.js'

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: "worketyamo/candidatures",
        resource_type: "raw",
        allowed_formats: ["pdf", "doc", "docx"],
        public_id: `${uuidv4()}-${file.originalname.replace(/\.[^/.]+$/, "")}`
    })
})

const ALLOWED_MIMES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

]

const multerUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024}, 
    fileFilter: (req, file, cb)=> {
        if (ALLOWED_MIMES.includes(file.mimetype)) {
            cb(null, true)
        }else {
            const error = new Error("File format unauthorized (PDF, DOC, DOCX only) ")
            error.statusCode = HttpCode.BAD_REQUEST
            cb(error)
        }
    }
})

export const upload = {
    single: (fieldName) => (req, res, next) => {
        try {
            multerUpload.single(fieldName)(req, res, (error) => {
                if (!error) return next()

                const statusCode = error.statusCode || (
                    error instanceof multer.MulterError
                        ? HttpCode.BAD_REQUEST
                        : HttpCode.INTERNAL_SERVER_ERROR
                )
                return res.status(statusCode).json({ message: error.message })
            })
        } catch (error) {
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "SERVER ERROR" })
        }
    }
}