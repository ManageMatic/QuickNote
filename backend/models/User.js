const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => {
            const now = new Date();
            const offsetIST = 5.5 * 60 * 60 * 1000;
            return new Date(now.getTime() + offsetIST);
        }
    }
});

const User = mongoose.model('user', UserSchema)
module.exports = User