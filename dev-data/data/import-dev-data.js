const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../model/tour');
const Review = require('../../model/review');
const User = require('../../model/user');

dotenv.config({ path: './config.env' })

//const DB = process.env.DATA.replace('<password>', process.env.DATA_PASSWORD);
const DB = "mongodb+srv://haim:z7JCCIGZ1QiXjwHs@cluster0.ssauxzn.mongodb.net/natours?retryWrites=true&w=majority";

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importDate = async () => {
    try {
        await Tour.create(tours);
        await Review.create(reviews);
        await User.create(users, { validateBeforeSave: false });
        console.log('Data successfull loaded');
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

// DELETE ALL DATA FROM DB
const deletData = async () => {
    try {
        await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('Data successfull deleted');
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if(process.argv[2] === '--import'){
    importDate();
} else if(process.argv[2] === '--delete') { 
    deletData();
}
