import { UploadedFile } from "express-fileupload";
import * as path from 'path';
import ApiError from "../Exeptions/ApiError";

class FileService {
    async saveFile({ file, fileName}:{file: UploadedFile, fileName: string}) {
        try {
            const filePath = path.resolve('images', fileName);
            file.mv(filePath);
            return fileName;
        } catch (error) {
            throw ApiError.BadRequest({ message: "Не удалось записать файл" })
        }
    }
}

export default new FileService();