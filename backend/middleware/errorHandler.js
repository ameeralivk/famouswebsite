export const notFound = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'Each image must be 5MB or smaller',
      LIMIT_FILE_COUNT: 'You can upload up to 3 images at a time',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field'
    };
    return res.status(400).json({ message: messages[err.code] || err.message });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `Duplicate value for ${field}` });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server error' });
};
