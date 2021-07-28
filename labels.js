const labels = {
    SITE : 'SITE',
    IMAGE : 'IMAGE',
    GIF : 'GIF',
    VIDEO : 'VIDEO',
    TEXT : 'TEXT'
};

const status = [
    'REGISTERED',
    'DONE'
    // 'ERROR',
];

const analyzeContent = (type, iswebhooks = false) => {
    const randStatus = status[Math.floor(Math.random() * status.length) + 1];

    if (randStatus === 'REGISTERED' || !iswebhooks) {
        return {
            status : 'REGISTERED'
        };
    }

    let output = {
        status : randStatus
    };

    let result = [];
    if( type === labels.SITE) {
        result = [ 'NONE', 'PORN', 'ESCORT', 'SEXUAL_CONTENT', 'HATE'];
    }
    else if(type === labels.IMAGE || type === labels.GIF || type === labels.VIDEO) {
        result = [ 'NONE', 'SEXUAL_ACTIVITY', 'NUDITY', 'ART_SEXUAL', 'EROTICA', 'NONE', 'CSAM', 'UNDERAGE_CHILD', 'UNDERAGE_TEEN', 'THREAT' ];
    } else if (labels.TEXT) {
        result = [ 'NONE', 'PERSONAL_INSULT', 'HATE', 'SHAMING', 'SELF_HARM', 'PROFANITY', 'SEXUAL_CONTENT_TALK', 'SEXUAL_CONTENT_ACTION', 'THREAT'];
    } else {
        return false;
    }

    output['results'] = process(result);
    return output;
}

const process = (data) => {
    const result = [];
    let dataSize = data.length;
    let rand = Math.floor(Math.random() * dataSize) + 1;
    if (rand == 0) {

        return [
            {
                confidence : (Math.floor(Math.random() * 100) + 1) / 100,
                label : data[0]
            }
        ];
    }

    if (rand == dataSize) {
        rand = dataSize - 1;
    }
    for (let index = 1; index <= rand; index++) {
        result.push({
            confidence : (Math.floor(Math.random() * 100) + 1) / 100,
            label : data[index]
        })
    }

    return result;
    
}

module.exports = {
    analyzeContent
}