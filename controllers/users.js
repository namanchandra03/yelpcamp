const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=>{

    res.render('users/register'); 
};

module.exports.registerUser = async(req,res)=>{

    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registerUser = await User.register(user,password);
    req.login(registerUser,(err,next)=>{

           if(err)return next(err);
           req.flash('success','Welcome to Yelp Camp!!')
           res.redirect('/campgrounds');
    })
    
    }
    catch(e){

           req.flash('error',e.message);
           res.redirect('register');
    }
};

module.exports.renderLoginForm = (req,res)=>{

    res.render('users/login');
};

module.exports.loggedInUser=(req,res)=>{

    req.flash('success','welcome back!');
    const redirectTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};

module.exports.loggedOutUser = (req,res)=>{

    req.logout();
    req.flash('success',"Goodbye!!");
    res.redirect('/campgrounds');
};