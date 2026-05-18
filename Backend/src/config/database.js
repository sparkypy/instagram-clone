import mongoose from "mongoose";

const DB_NAME = "instagram";
async function connectToDatabase() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    const { host, port, name } = mongoose.connection;
    console.log(`MongoDB connected → ${host}:${port}/${name}`);
  } catch (err) {
    if (err instanceof Error) {
      console.log(
        "Failed to Connect to the Database\n",
        `${err.name}: ${err.message}`,
      );
    }
  }
}

export { connectToDatabase };
