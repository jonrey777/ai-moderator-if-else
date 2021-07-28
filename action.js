const axios = require('axios');
const { analyzeContent } = require('./labels');
const { v4 : uuidv4 } = require('uuid');

const Action = (db) => {
    const applicationModel = require('./models/applicationsModel')(db);
    const assetsModel = require('./models/assetsModel')(db);

    
    const analyze = async (data) => {
        console.log('analyze call');

        const output = [];
        data['rid'] = uuidv4();
        data['date_created'] = Date.now();
        await applicationModel.upsert(data);
        const { assets, application_sid } = data;
        const assetsSize = assets.length;
        for (let index = 0; index < assetsSize; index++) {
            let result = analyzeContent(assets[index].type);
            assets[index].asset_id = uuidv4();
            if (result.status == 'REGISTERED') {
                output.push({
                    ...result,
                    aid: assets[index].aid
                });
            } else {
                output.push({
                    ...result,
                    ...assets[index],
                    date_complete : Date.now()
                });
            }
            assets[index] = {
                ...assets[index],
                ...output[0]
            }
            await assetsModel.upsert(application_sid, assets[index]);
        }

        data['assets'] = output;
        return data;
    };

    const webhook = async ({platform_url, platform_token}) => {
        console.log('webhook call');
        const output = [];
        let undone = await assetsModel.getUndoneOne();
        if (!undone) {
            console.log('nothing to analyze')
            return;
        }

        const applicationData = await applicationModel.findApplicationId(undone.application_sid);
        let result = analyzeContent(undone.type, true);
        output.push({
            ...result,
            ...undone,
            status : 'DONE'
        });

        applicationData['assets'] = output;
        undone = {
            ...undone,
            ...output[0]
        }
        const options = {
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${platform_token}`
            }
        }
        const resulthttp = await axios.post(`${platform_url}/api/l1ght-webhook`, applicationData, options);

        if (resulthttp.status >= 200 && resulthttp.status <= 299) {
            if (resulthttp.data?.error_code) {
                console.log(resulthttp.data);
            } else {
                console.log('webhook done');
                await assetsModel.upsert(undone.application_sid, undone);
            }
        } else {
            console.log(resulthttp.statusText);
        }

        return true;
    }

    return {
        analyze,
        webhook
    };
};

module.exports = Action;