import mongoose from "mongoose";

const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to Mongo", error);
      process.exit(1);
    });
};
export default dbConnect;
