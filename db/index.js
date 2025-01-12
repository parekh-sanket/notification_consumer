const mongoose = require('mongoose')
const config = require('config')

async function connectDb(){

    let mongoCredentials = config.get("mongo")

    const MONGO_URI = `mongodb://${mongoCredentials.db_user}:${mongoCredentials.db_password}@${mongoCredentials.db_host}/${mongoCredentials.db_name}`

    let mongo = await mongoose.connect(MONGO_URI)

    console.log(">>> MongoDB conneted successfully <<<")
}

module.exports = {
    connectDb
}