const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Student = new Schema({
    city: {
        type: String
    },
    company: {
        type: String
    },
    email: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    grades: {
        type: [Number]
    },
    id: {
        type: Number
    },
    pic: {
        type: String
    },
    skill: {
        type: String
    }
});

module.exports = mongoose.model('Student', Student);