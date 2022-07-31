const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{

   await Campground.deleteMany({});

   for(let i=0;i<50;i++){

             const randomNo = Math.floor(Math.random()*1000);
             const price  = Math.floor(Math.random()*20) + 10;
             const camp = new Campground({
                author:'61265248c22e5c05f049bec9',
                location:`${cities[randomNo].city} , ${cities[randomNo].state}`,
                title:`${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores quas corporis distinctio totam repellendus. Iusto suscipit itaque accusamus eligendi quas cumque reprehenderit? Nesciunt eius quaerat aliquam perferendis, quis vero. Officiis.',
                price,
                geometry:
                { 
                    type: 'Point', 
                  
                    coordinates: [ 

                         cities[randomNo].longitude,

                         cities[randomNo].latitude
                     ] 
                
                },

                images: [
                    {
                      url: 'https://res.cloudinary.com/dgrhr/image/upload/v1630856399/YelpCamp/q91jrwtwphjuykwoco70.jpg',
                      fileName: 'YelpCamp/q91jrwtwphjuykwoco70'
                    }
                  ],
                
             })

            await camp.save();
   }
}

seedDB().then(()=>{

    mongoose.connection.close();
});

