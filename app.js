require('dotenv').config();
const fs = require('fs').Promise;
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/authRoutes');
//db setup
mongooseURL = 'mongodb+srv://backendconcoxdeveloper:<PASSWORD>@cluster0-zhjde.mongodb.net'.replace('<PASSWORD>', process.env.MONGOOSE_PASSWORD );
mongoose.connect(mongooseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

//sub-application
app.use('/auth' , auth);


app.listen(process.env.PORT , () =>{
    console.log(`server is runnong at ${process.env.PORT}`);
})