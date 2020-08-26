 const mongoose = require('mongoose');

/* Schema for todo */
const todoSchema = new mongoose.Schema({
    title: {
        type: String
    }, 
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Auth'
    }
}, {
    timestamps: true
});

/* Converting model from schema */
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;