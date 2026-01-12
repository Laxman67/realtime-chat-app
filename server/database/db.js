import mongoose from 'mongoose';
import logger from '../utils/logger.js';
// Connection
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
    .then(() => {
      console.log('Database Connected Successfully');
      logger.info('Database Connected Successfully');
    })
    .catch((err) => {
      console.log('Error Occurred while connecting to Database', err);
      logger.info('Error Occurred while connecting to Database', err);
    });
};

export default connectDB;
