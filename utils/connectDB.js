import mongoose from 'mongoose';

const URL = process.env.MONGODB_URL;

const connectDB = () => {
    if (mongoose.connections[0].readyState) {
        console.log("Already connected.");
        return;
    }

    mongoose.connect(URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log("connected to mongodb");
    })
}

export default connectDB;
