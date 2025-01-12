const config = require('config')
const mongoConnection = require('./db/index')
const kafkaConnection = require('./kafka/index')
const notificationService = require('./service/notification.service')

async function init(){
    try{
        await Promise.all([mongoConnection.connectDb() , kafkaConnection.connectKafka()])

        const notificationConsumer =  async ({topic, partition, message}) => {
            try{
                message = message.value.toString()
                
                console.log("LOG >>> message received " , message)

                message = JSON.parse(message)

                notificationService.processNotification({ payload : message })

            }catch(err){
                console.log("Error in notificationConsumer >>> " , err)
            }
        }

        await kafkaConnection.kafkaConsumer({
            topic : config.get("kafka.sendNotificationsTopic"),
            notificationConsumer : notificationConsumer
        })

    }catch(err){
        console.log("Error in init function " , err)
        process.exit(0)
    }
}

init().then().catch()
