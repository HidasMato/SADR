import { UploadedFile } from "express-fileupload";
import * as uuid from 'uuid';
import * as path from 'path';

class FileService {
    async saveFile({ file, fileName}:{file: UploadedFile, fileName: string}) {
        try {
            // const fileName = uuid.v4() + '.png';
            const filePath = path.resolve('images', fileName)
            file.mv(filePath);
            return fileName;
        } catch (error) {
            console.log(error)
            throw new Error ("Не удалось записать файл")
        }
    }
}

export default new FileService();