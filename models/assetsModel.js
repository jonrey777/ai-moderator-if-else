const { forEach } = require('lodash');

const AssetsModel = (db) => {

    const { assets } = db;

    const getUndoneOne = () => new Promise(resolve => {
        assets.findOne({$not : { status : 'DONE'}}, (err, doc) => {
            resolve(doc);
        })
    });

    const upsert = (application_sid, data) => new Promise(resolve => {
        const _data = {
            ...data,
            application_sid : application_sid,
        };

        assets.update({
            aid: _data.aid
        }, { $set : _data }, { upsert : true}, () => resolve());
    });

    return {
        upsert,
        getUndoneOne
    }

};

module.exports = AssetsModel;