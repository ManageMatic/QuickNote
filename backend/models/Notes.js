const mongoose = require('mongoose');
const { type } = require('os');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    pinned: {
        type: Boolean,
        default: false
    },
    favorite: {
        type: Boolean,
        default: false
    },
    trashed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    reminder: {
        type: Date,
        default: null
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: "transparent"
    },
});

module.exports = mongoose.model('notes', NoteSchema)