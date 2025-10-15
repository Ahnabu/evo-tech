import { cloudinaryUpload } from "../config/cloudinary.config";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "evo-tech"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryUpload.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinaryUpload.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
