const mongoose = require('mongoose');


/* Connect to mongoDB locally */
mongoose.connect(`mongodb://127.0.0.1:27017/todo`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});




/* Connect to malb db using mongoose */

// const USERNAME = 'your_mlab_username';
// const PASSWORD = 'your_malab_password_here' //

// mongoose.connect(`your_mlab_mongodb_url_here!`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })
// .then(() => {
//     console.log('Connected to DB');
// }).catch(err => {
//     console.error(err);
// });


module.exports =  mongoose;