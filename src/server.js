import express, { request, response } from 'express';

const app = express();

app.get('/hello', (request, response) => response.send('Hello'));

app.listen(8000, () => console.log('Listening in Port 8000'));