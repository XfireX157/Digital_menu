import { diskStorage } from 'multer';
import { file } from 'src/Config/configuration';

export const multerConfig = {
  storage: diskStorage({
    destination: file,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
};
