import { Server } from 'socket.io';
import logger from '../utils/logger.js';

const userSocketMap = {};

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user is connected to the server', socket.id);
    logger.info('A user is connected to the server', socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUser', Object.key(userSocketMap));

    socket.on('disconnect', () => {
      console.log('A user is disconnected', socket.io);
      logger.warn('A user is disconnected', socket.io);
      delete userSocketMap[userId];
      logger.warn('deleted! ', userSocketMap[userId]);

      io.emit('getOnlineUser', Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
export { io };
