const mongoose = require("mongoose")
const Schema = mongoose.Schema
const model = mongoose.model

const notificationSchema = new Schema(
    {
        userId: {
            type: Number,
        },
        message: {
            type: String,
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