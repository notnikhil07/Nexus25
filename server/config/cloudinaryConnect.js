import cloudinary from "cloudinary";

const cloudinaryConnect = async () => {
  try {
    await cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    console.log("Connected to Cloudinary");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default cloudinaryConnect;
