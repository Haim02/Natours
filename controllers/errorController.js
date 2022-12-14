const AppError = require('./../utils/appError');

const handlecastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    
    const message = `Duplicate field value: ${value}. Please use another value!`; 
    return new AppError(message, 400);
};

const handleValidatorErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`; 
    return new AppError(message, 400);
}

const handleJWTError = () => {
    return AppError('Inalid token. Please log in again!', 401)
}

const handelJWTExpiredError = () => {
    return AppError('Your token has expired!. Please log in again!', 401)
}

const sendErrorDev = (err, req,  res) => {
    // API
    if (req.originalUrl.startsWith('./api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    } 
        // RENDERED WEBSITE
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    };

const sendErrorProd = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
      // Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      //  Programming or other unknown error: don't leak error details
      //  Log error
      console.error('ERROR 💥', err);
      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  
    //  RENDERED WEBSITE
    //  Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
    }
    //  Programming or other unknown error: don't leak error details
    //  Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.'
    });
  };

module.exports = (err, req, res, next) => {
    console.log(err.stack)

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
        
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        error.message = err.message;
        error.message = err.message;
        if (error.name === 'CastError') {
            error = handlecastErrorDB(error);
        }

        if (error.code === 1100) {
            error = handleDuplicateFieldsDB(error)
        }

        if (error.name === 'ValidatorError') {
            error = handleValidatorErrorDB(error);
        }

        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError()
        }

        if (error.name === 'TokenExpiredEroor') {
            error = handelJWTExpiredError()
        }
        sendErrorProd(error, req, res)
    }
};