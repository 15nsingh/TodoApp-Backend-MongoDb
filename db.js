const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    }
})

const todoSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false
    }
})


const User = mongoose.model('users',userSchema)

const Todo = mongoose.model('todos',todoSchema)

module.exports = {User, Todo}