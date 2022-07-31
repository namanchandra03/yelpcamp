const mongoose = require('mongoose');
const { campgroundSchema } = require('../joischemas');
const Schema  = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({

        url:String,
        fileName:String
    
});

const opts = { toJSON: { virtuals: true } };

imageSchema.virtual('thumbnail').get(function (){

     return this.url.replace('/upload','/upload/w_200');
})


const CampgroundSchema = new Schema({

    title: String,
    images:[imageSchema] ,
    geometry:{

        type:{

            type:String,
            enum:['Point'],
            required:true
        },

        coordinates:{

            type:[Number],
            required:true
        }
    },
    price: Number,
    description: String,
    location:String,
    author:{
            
          type:Schema.Types.ObjectId,
          ref:'User'
       },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {

      return `<strong><a href="/campgrounds/${this._id}"><h3>${this.title}</h3></a><strong>`
})

CampgroundSchema.post('findOneAndDelete',async function (doc){

       if(doc){

            await Review.deleteMany({
                _id:{
                        
                $in:doc.reviews           
            }})
       }
} );

module.exports = mongoose.model('Campground',CampgroundSchema);