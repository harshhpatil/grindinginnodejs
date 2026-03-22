import mongoose from "mongoose";

let isConnected = false;

const dbConnection = async () => {
  // returning if the connection is already established
  if (isConnected || mongoose.connection.readyState == 1) {
    console.log("using existing connection");
    return;
  }

  try {
    // checking if the connection string is being recieved
    if (!process.env.MONGO_URI) {
      throw new Error(".env variable doesn't exists or not loaded properly");
    }

    await mongoose.connect(process.env.MONGO_URI); // connecting to the datbase
    isConnected = mongoose.connections[0].readyState === 1; // updating the isConnected status
    console.log("database connected successfully..!!");
  } catch (err) {
    console.error("error occured in the dbConnection.js", err);
    throw err;
  }
};

export default dbConnection;
