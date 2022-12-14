const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')
const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
// GLOBAL MIDDLEWARES


// serving static files
app.use(express.static(`${__dirname}/public`))
//app.use(express.static(path.join(__dirname, 'public'))); 


// Set security HTTP headers
app.use(helmet());

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({ 
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter) 

// Body parser, reding data from body into req.body
app.use(express.json({ limit: '10kb'}));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser())

//Dat sanitiaion against NoSQL quert injection
app.use(mongoSanitize());

//Data sanitiaion against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupsize',
        'difficulty',
        'price' 
    ]
}))

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)); 
// ROUTES

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// all http method
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handliing middleware
app.use(globalErrorHandler); 

module.exports = app;