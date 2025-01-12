async function sendNotification({payload}) {
    try {
        let status

        switch(payload.channel){
            case "email" :
                status = await sendNotificationOnEmail({payload}) 
                break
            case "sms" :
                status = await sendNotificationOnSms({payload}) 
                break
            case "push" :
                status = await sendNotificationOnPush({payload}) 
                break
        }

        return status
    } catch (err) {
        console.log("Error in sendNotification >>> ", err)
        return "failed"
    }
}
   
async function sendNotificationOnEmail({payload}) {
    try{
        // we can use any thirdparty integration here
        console.log(
            `Sending ${payload.channel} to user ${payload.userId} message ${payload.message}`,
        )
        
        return "delivered"
    }catch(err){
        console.log("Error in sendNotificationOnEmail >> " , err)
        return 'failed'
    }
}

async function sendNotificationOnSms({payload}) {
    try{
        // we can use any thirdparty integration here

        console.log(
            `Sending ${payload.channel} to user ${payload.userId} message ${payload.message}`,
        )

        return "delivered"
    }catch(err){
        console.log("Error in sendNotificationOnSms >> " , err)
        return 'failed'
    }
}

async function sendNotificationOnPush({payload}) {
    try{
        // we can use any thirdparty integration here

        console.log(
            `Sending ${payload.channel} to user ${payload.userId} message ${payload.message}`,
        )

        return "delivered"
    }catch(err){
        console.log("Error in sendNotificationOnPush >> " , err)
        return 'failed'
    }
}

module.exports = {
    sendNotification
}