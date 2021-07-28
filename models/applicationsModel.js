const ApplicationsModel = (db) => {

    const { applications } = db;

    const findApplicationId = (application_sid) => new Promise(resolve => {
        applications.findOne({application_sid}, (err, doc) => {
            resolve(doc);
        })
    });

    const upsert = (data) => new Promise(resolve => {
        const _data = {
            application_sid : data.application_sid,
            account_sid : data.account_sid,
            api_version : data.api_version,
            rid : data?.rid,
            date_created : data?.date_created
        };

        applications.update({
            application_sid: _data.application_sid
        }, { $set : _data }, { upsert : true}, () => resolve());
    });

    return {
        upsert,
        findApplicationId
    }

};

module.exports = ApplicationsModel;