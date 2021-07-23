const mongoose = require("mongoose");

module.exports = connection = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            autoIndex: true,
        };
        await mongoose.connect(process.env.DB_CONNECT_URI, connectionParams);
        console.log("Connected to Database..");
    } catch (error) {
        console.log(error, "Could not connect to Database..");
    }
}