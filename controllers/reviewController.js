const Review = require('../model/review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    if(req.body.tour) {
        req.body.tour = req.body.tour
    }
    
    if(req.body.user) {
        req.body.user = req.body.user
    }
}

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync(async(req, res, next) => {
//         const newReview = await Review.create(req.body);

//         res.status(201).json({ 
//             status: 'success', 
//             data: {
//                 review: newReview
//             }
//         })
// });

exports.getAllReview = factory.getAll(Review);

// exports.getAllReview = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if(req.params.tourId) {
//         filter = { tour: req.params.tourId }
//     }
//         const reviews = await Review.find(filter);

//         if(!reviews) {
//             return next(new AppError('No thour was found', 404))
//         }
//         res.status(200).json({
//             status: 'success',
//             results: reviews.length,
//             data: {
//                 reviews
//             }
//         })
// });

exports.getOneReview = factory.getOne(Review);

// exports.getOneReview = catchAsync(async (req, res, next) => {
//         const review = await Review.findById(req.params.id);

//         if(!review) {
//             return next(new AppError('No thour found with that ID', 404))
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 review
//             }
//         })
// });

exports.updateReview = factory.updateOne(Review);

// exports.updateReview = async (req, res, next) => {
//     try {
//         const review = await Review.findByIdAndUpdate(req.params.id, req.body);

//         if(!review){
//             return next();
//         };

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 review
//             }
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: 'fail',
//             message: error
//         })
//     }
// };

exports.deleteReview = factory.deleteOne(Review);

// exports.deleteReview = async (req, res, next) => {
//     try {
//         const review = await Review.findByIdAndDelete(req.params.id);
        
//         if(!review){
//             return next();
//         };

//         res.status(200).json({
//             status: 'success',
//             message: 'review was deleted'
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: 'fail',
//             message: error 
//         })
//     }
// }