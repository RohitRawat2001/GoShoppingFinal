const mongoose = require("mongoose");

const connectdatabase = () => {
    mongoose.connect(process.env.DB_URL)
        .then((data) => {
            console.log(`mongodb is connected ${data.connection.host}`)
        })
}
module.exports = connectdatabase;