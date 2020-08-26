const express = require('express');

const route = express.Router();
const Todo = require('../models/todo');
const auth = require('../middleware/authentication');

/*post route for the adding todo */
route.post('/todo', auth, async (req, res) => {
    const todo = new Todo({
        ...req.body,
        owner: req.user._id
    })

    try {
        await todo.save();
        res.status(201).send(todo)
    } catch (error) {
        res.send(400).send(error)
    }
})

/*get route for the getting all todo list */
route.get('/todo', auth, async (req, res) => {
    try {
    await req.user.populate({
        path: 'todos',
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip) * parseInt(req.query.limit),
            sort: {
                createdAt: -1
            }
        }
    }).execPopulate();
    const totalTodo = await Todo.find({ 'owner': req.user._id }).countDocuments();
    res.send({
        todo: req.user.todos,
        totalTodo
    })
    } catch (error) {
        res.send(500).send(error)
    }
});


/* Getting todo by id route */
route.get('/todo/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const todo = await Todo.findOne({ _id, owner: req.user._id});
        
        if(!todo) {
            return res.status(400).send();
        }

       res.status(200).send(todo);
    } catch (error) {
        res.send(500).send(error)
    }
});

/*update route for the updating todo by id */
route.patch('/todo/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if(!isValidUpdates) {
        return res.status(400).send({
            error: 'Invalid updates!'
        });
    }
    try {
        const todo = await Todo.findOne({ _id: req.params.id, owner: req.user._id });
        if(!todo) {
            return res.status(404).send();
        }
        updates.forEach(update => todo[update] = req.body[update]);
        await todo.save();
        res.send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

/* Deleting todo by id */
route.delete('/todo/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, owner: req.user._id}); 
                
        if(!todo) {
            return res.status(400).send();
        }
       res.status(200).send(todo);
    } catch (error) {
        res.send(500).send(error)
    }
});

module.exports = route;