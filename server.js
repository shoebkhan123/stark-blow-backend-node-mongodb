const express = require('express');

require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

const todoRoute = require('./routers/todo');
const authRoute = require('./routers/auth');

/* Cross origin resource sharing prevention */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
  });
  

app.use(express.json());
app.use(todoRoute);
app.use(authRoute);

/* creating server which listing port */
app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});