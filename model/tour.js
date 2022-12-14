const slugify = require('slugify')
const mongoose = require('mongoose');
const validator = require('validator');
// const User = require('./user');


const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have less or equal then 40 characters'],
        minLength: [10, 'A tour name must have more or equal then 10 characters'],
        //validate: [validator.isAlpha, 'Tour name must only contain characters'] 
    },
    slug: String,
    
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) /10  // Run each time a new value is set for this field
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    // rating: {
    //     type: Number,
    //     default: 4.5
    // },
    price: {
         type: Number,
         required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this only point to current doc on NEW documen creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    } ,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a image']
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    _id: Object,

    startLocation: {
        type: { 
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, 

{
    toJSON: { virtual: true},
    toObject: { virtual: true}
});

tourSchema.index({ price: 1, ratingsAverage: -1});
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeek').get(function () {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
})

// DOCUMENT MIDDLEWARE: runs before .save() and create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true})
    next();
});

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async (id) => {
//         return await User.findById(id)
//     })
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })


module.exports = mongoose.model('Tour', tourSchema);