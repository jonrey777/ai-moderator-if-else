const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({ path: '.env.settings' });
const { HOST, PORT, PLATFORM_URL, PLATFORM_TOKEN } = process.env;

const DataStore = require('nestdb');
const db = {};
db.applications = new DataStore({ filename: 'db/application.db', autoload: true });
db.assets = new DataStore({ filename: 'db/assets.db', autoload: true });

const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({}));

app.listen(PORT, () => console.log(PORT));

app.post('/v1/analyze', async (req, res) => {
    const request = req.body;
    const result = await action.analyze(request);
    res.send(result);
});

const cron = require('./cron');
const action = require('./action')(db);

cron({
    platform_url : PLATFORM_URL,
    platform_token : PLATFORM_TOKEN
}, action.webhook, 7);