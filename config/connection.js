const mongoose=require('mongoose');

const URI="mongodb+srv://book1234:bfh2021@cluster0.y2gry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDb= async()=>{
    await mongoose.connect(URI,{ useUnifiedTopology: true, useNewUrlParser: true });
    console.log("db connected...");
}
module.exports= connectDb;