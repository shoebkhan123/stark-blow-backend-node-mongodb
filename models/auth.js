const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* Schema for User */
const AuthSchema = new mongoose.Schema({
    name: {
        type: String
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    age: {
        type: String,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, 
{
    timestamps: true
});

/* Virtual storage */
AuthSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'owner'
})

/* Deleting password and token array before sending user */ 
AuthSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

/* Method for generating authentication token from jwt */
AuthSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'StarkFlowAssignmnet');
    user.tokens = user.tokens.concat({ token });

    await user.save();
    return token
}

/*  Finding user is by email and password */
AuthSchema.statics.findByCredentials = async (email, password) => {
    const user = await Auth.findOne({ email })
    if(!user) {
        throw new Error('Unable to login!')
    }
    const isMath = await bcrypt.compare(password, user.password);

    if(!isMath) {
        throw new Error('Unable to login!')
    }
    return user;
}


/* Hashing the password before saving */
AuthSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})


/* Converting model from schema */
const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;