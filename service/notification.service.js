const config = require('config')
const {Notification} = require("../db/model/notification.model")
const kafkaService = require('../kafka/index')
const sendNotificationService = require('./sendNotification.service')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const cron = require('node-cron')

const BUFFER_TIME_IN_SECONDS = 60

async function processNotification({payload}) {
    let notificationObj
    try {
        let status = "pending"

        if(!payload.isRetry && !payload.isScheduled){
            // if message is not retry then store data in database
            notificationObj = await Notification.create({
                ...payload,
                status,
            })

        }else if(payload.isRetry){
            notificationObj = payload.notificationObj

            notificationObj = await Notification.findOneAndUpdate({
                _id : new ObjectId(notificationObj._id)
            },{
                $inc : {retryCount : 1},
                lastRetryAt : new Date()
            },{
                new : true
            })
        }else{
            notificationObj = payload.notificationObj
        }

        // process all message which is high priority, or sendTime is not given or isScheduled is true
        if (payload?.isRetry || payload?.isScheduled || !payload?.scheduleTime) {
            status = await sendNotificationService.sendNotification({payload})
            // if failed then retry 3 time
            if(status === 'failed'){
                if(!notificationObj?.retryCount || notificationObj?.retryCount < 3){
                    return processNotification({ payload : {...payload, notificationObj : notificationObj, isRetry : true}})
                }
            }
        }

        // update message status
        await Notification.updateOne({
            _id : notificationObj._id
        },{
            $set : {
                status : status
            },
        })

    } catch (error) {
        console.error("Error processing notification:", error)
    }
}

async function processScheduledNotifications() {
    try {
        const now = new Date()
        const bufferTime = new Date(now.getTime() - BUFFER_TIME_IN_SECONDS * 1000).toISOString() // 10 second buffer time 

        const scheduledNotifications = await Notification
            .find({
                scheduleTime: {
                    $lte: now.toISOString(),
                    $gte: bufferTime
                },
                status: "pending",
            })

        console.log(`LOG >>> found ${scheduledNotifications.length} no of schedule message`)
        
        // create payload and do re process on message
        for(let notification of scheduledNotifications){
            notification = notification.toJSON()
            processNotification({
                payload : {
                    ...notification,
                    notificationObj : notification,
                    isScheduled : true
                }
            })
        }
    } catch (error) {
        console.error("Error in Scheduled Notification Processing:", error)
    }
}

// Run the scheduler every 10 seconds
cron.schedule("*/1 * * * *", processScheduledNotifications)

module.exports = {
    processNotification,
}
