class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next) => {
    // Handle custom ApiError
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
  
    // Handle CastError (invalid ObjectId format)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: ${err.value}`,
      });
    }
  
    // Fallback for other errors
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  };
export { ApiError, errorHandler };
