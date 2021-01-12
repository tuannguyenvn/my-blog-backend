import express from 'express';
import bodyParser from 'body-parser';

const articlesInfo = {
    'learn-react': {
        upvotes: 0,
    },
    'learn-node': {
        upvotes: 0,
    },
    'my-thoughts-on-resumes': {
        upvotes: 0,
    },
};

const app = express();

app.use(bodyParser.json());
app.get('/hello', (req, res) => res.send('Hello'));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name} `));
app.post('/articles/:name/upvote', (req, res) => {
    const artikelName = req.params.name;
    articlesInfo[artikelName].upvotes += 1;
    res.status(200).send(`${artikelName} now has ${articlesInfo[artikelName].upvotes}`);
});


app.listen(8000, () => console.log('Listening in Port 8000'));