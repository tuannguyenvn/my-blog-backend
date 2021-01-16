import express from 'express';
import bodyParser from 'body-parser';
import MongoClient from 'mongodb';

const app = express();

const withdb = async(operation, res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017',  {useNewUrlParser: true} );
        const db = client.db('my-blog');

        await operation(db);

        client.close();
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error });         
    }
};

app.use(bodyParser.json());
app.get('/hello', (req, res) => res.send('Hello'));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name} `));

app.post('/api/articles/:name/upvote', async(req, res) => {
    withdb (async(db) => {   
        const articleName = req.params.name;
    
        const articlesInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                upvotes : articlesInfo.upvotes +1 ,
            },           
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
    
        res.status(200).json(updatedArticleInfo);        
    },res); 
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    withdb (async(db) => {
        const articleName = req.params.name;
        const {username, text} = req.body;

        const articlesInfo = await db.collection('articles').findOne({name: articleName});
        await db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                comments : articlesInfo.comments.concat({ username, text }),
            },
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
    
        res.status(200).json(updatedArticleInfo);    
    }, res);
});

app.get('/api/articles/:name', async(req, res) => { 
    withdb(async (db) => {
        const articleName = req.params.name;
        const articlesInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articlesInfo);
    }, res);
});

app.listen(8000, () => console.log('Listening in Port 8000'));