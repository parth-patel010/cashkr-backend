const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      message: 'Upload too large. Compress photos and try again.',
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation Error', errors: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (
    err.name === 'MongoServerError'
    || err.name === 'MongoNetworkError'
    || err.name === 'MongoNotConnectedError'
    || /not connected|buffering timed out|connection closed/i.test(String(err.message || ''))
  ) {
    return res.status(503).json({
      message: 'Database temporarily unavailable. Please try again in a moment.',
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
