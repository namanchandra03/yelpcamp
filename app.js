if(process.env.NODE_ENV!=="production"){

    require('dotenv').config();
}

console.log(process.env.secret);

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require("connect-mongo");

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL, 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useFindAndModify:false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!

     console.log('we are connected');
});

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

app.use(mongoSanitize());

app.engine('ejs',ejsMate);

app.set('view engine','ejs');

app.set('views',path.join(__dirname,'views'));

app.set('public',path.join(__dirname,'public'));

app.use(express.static('public'));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({

    mongoUrl:DB_URL,
    secret,
    touchAfter:24*60*60
});

store.on("error",(e)=>{

   console.log("error in session stoarge",e);
});

const sessionConfig = {
    
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{

        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
};

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{

      res.locals.currentUser = req.user;
      res.locals.success = req.flash('success');
      res.locals.error=req.flash('error');
      next();
})

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);
app.use('/',userRoutes);

app.get('/',(req,res)=>{

    res.render('home',{});
})




app.all('*',(req,res,next)=>{

    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{

    const{statusCode=500} = err;

    if(!err.message)err.message='Something went wrong';

    res.status(statusCode).render('error',{err});

})

const port = process.env.PORT || 3000;

app.listen(port,()=>{

    console.log(`listening on port ${port} !!`);
})