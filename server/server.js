import app from './app.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from './utils/logger.js';
import http from 'http';
import { initSocket } from './utils/socket.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create server to socket

const server = http.createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(
    `Sever is listening to http://localhost:${process.env.PORT} in [${process.env.NODE_ENV}] Environment `
  );
  logger.info(
    `Sever is listening to http://localhost:${process.env.PORT} in [${process.env.NODE_ENV}] Environment `
  );
});
