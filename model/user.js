const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const salt = 10;

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: [true, 'A user must have a name'],
    },
    email: {
        type : String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type : String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type : String,
        required: [true, 'Please provide a password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(pass) {
                return pass === this.password
            }
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    //Only run this function was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with salt
    this.password = await bcrypt.hash(this.password, salt);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next()
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew){
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, function(next) {
    // this point to the current query
    this.find({ active: { $ne: false } });
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.ChangedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        )
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    //   console.log({resetToken}, this.passwordResetToken);
      this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

      return resetToken
}


module.exports = mongoose.model('User', userSchema);
