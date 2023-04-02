const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;
const Jimp = require("jimp");
const fs = require("fs").promises;
const { AppError } = require("../utils");

const uploadDir = path.join(process.cwd(), "tmp");
const pathToAvatars = path.join(process.cwd(), "public/avatars");

class ImageService {
  static upload(name) {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const multerFilter = (req, file, callbackFn) => {
      if (file.mimetype.startsWith("image")) {
        callbackFn(null, true);
      } else {
        callbackFn(new AppError(400, "Upload images only.."), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }).single(name);
  }

  static async save(user, data) {
    const fileName = `${user.id}-${uuid()}.jpeg`;

    const { path: pathToTmp } = data;
    const publicPathToAvatar = path.join(pathToAvatars, fileName);

    const avatar = await Jimp.read(pathToTmp);
    avatar.cover(250, 250).write(publicPathToAvatar);

    await fs.unlink(pathToTmp);

    return fileName;
  }
}

module.exports = ImageService;
