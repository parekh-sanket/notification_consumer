const {Kafka} = require("kafkajs")
const config = require("config")
let consumer
let producer

async function connectKafka() {
    const kafka = new Kafka({
        brokers: config.get("kafka.brokers"),
    })
    producer = kafka.producer()
    await producer.connect()

    consumer = kafka.consumer({groupId: config.get("kafka.sendNotificationsGroup")})
    await consumer.connect()

}

async function kafkaConsumer({topic, notificationConsumer}) {
    await consumer.subscribe({
        topic: topic,
        fromBeginning: true,
    })
    await consumer.run({
        eachMessage: notificationConsumer
    })
}

async function kafkaProducer({
    topic,
    messages
}){
    await producer.send({
        topic: topic,
        messages: messages
    })

    console.log(`>>> kafka message produced on topic ${topic} payload` , messages)
}


module.exports = {
    connectKafka,
    kafkaConsumer,
    kafkaProducer
}
