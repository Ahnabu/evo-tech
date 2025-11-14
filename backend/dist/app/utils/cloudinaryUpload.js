"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const uploadToCloudinary = async (fileBuffer, folder = "evo-tech") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.cloudinaryUpload.uploader.upload_stream({
            folder: folder,
            resource_type: "auto",
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result?.secure_url || "");
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary_config_1.cloudinaryUpload.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinaryUpload.js.map