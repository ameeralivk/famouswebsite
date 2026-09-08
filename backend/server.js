// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js';
// import couponRoutes from './routes/couponRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js';
// import { notFound, errorHandler } from './middleware/errorHandler.js';

// await connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes);

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Famous Hardware API running on port ${PORT}`));
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// 1. Ensure DB connects per request via middleware instead of top-level await
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

// 2. Only listen locally; Vercel serverless handles incoming HTTP calls automatically.
// Check for VERCEL (auto-injected in every Vercel environment) rather than NODE_ENV, since
// NODE_ENV isn't set automatically for serverless function runtime.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Famous Hardware API running on port ${PORT}`));
}

// 3. Export the Express app for Vercel's Node runtime
export default app;