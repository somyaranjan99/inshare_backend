
const mongoose= require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_DB_URL,{dbName:"inshare"});
        const connection = mongoose.connection;
        connection.once('open', () => {
            console.log('Database connected 🥳🥳🥳🥳');
        }).on('error', function (err) {
            console.log(err);
          });
}
module.exports=connectDB;