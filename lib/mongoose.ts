import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
  if (isConnected) {
    console.log("DB Already Connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string).then(() => {
      isConnected = true;
      console.log("DB connected");
    });
  } catch (error) {
    console.log(error)
  }
};
