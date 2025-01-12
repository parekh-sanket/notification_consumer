const mongoose = require("mongoose")
const Schema = mongoose.Schema
const model = mongoose.model

const notificationSchema = new Schema(
    {
        userId: {
            type: String,
        },
        message: {
            type: String,
        },
        channel : {
            type : String,
            require : true,
            enum : ['email', 'sms', 'push']
        },
        email : {
            type : String,
        },
        mobile : {
            type : String,
        },
        devicePushToken : {
            type : String
        },
        status : {
            type : String,
            default : "pending",
            enum : ["pending", "processing", "delivered", "failed"]
        },
        scheduleTime: {
            type: Date,
        },
        retryCount : {
            type : Number
        },
        lastRetryAt : {
            type : Date
        }
    },
    {
        timestamps: true,
    },
)

const Notification = model("usernotification", notificationSchema)

module.exports = {
    Notification,
}