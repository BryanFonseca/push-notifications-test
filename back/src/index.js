import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/api/save-subscription', (req, res) => {
    res.status(200).send('Hello world');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});