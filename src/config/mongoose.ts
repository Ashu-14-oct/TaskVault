import mongoose from "mongoose";

const mongoDB = mongoose.connect('mongodb://localhost:27017/todo')
.then(() => console.log("Connected to the mongodb"))
.catch((err) => {console.log(err);
})

export default mongoDB;