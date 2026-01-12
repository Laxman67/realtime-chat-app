import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import logger from './utils/logger.js'; // 👈 winston logger
import connectDB from './database/db.js';
import userRoutes from './routes/user.routes.js';
import bodyParser from 'body-parser';

const app = express();

// Load env
config({ path: './config/config.env' });

/* ===============================
   Request Logger Middleware
================================ */
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

/* ===============================
   Mandatory Middlewares
================================ */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/',
  })
);

// Routes
app.use('/api/v1/user', userRoutes);
// Connection to DB
connectDB();

/* ===============================
   Global Error Handler
================================ */
app.use((err, req, res, next) => {
  logger.error(err); // logs stack trace automatically

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
