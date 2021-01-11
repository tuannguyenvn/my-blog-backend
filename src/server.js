import express, { request, response } from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.get('/hello', (request, response) => response.send('Hello'));
app.post('/hello', (request, response) => response.send(`Hello ${request.body.name} `));


app.listen(8000, () => console.log('Listening in Port 8000'));