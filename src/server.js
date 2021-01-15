import express from 'express';
import bodyParser from 'body-parser';
import MongoClient from 'mongodb';

const app = express();

app.use(bodyParser.json());
app.get('/hello', (req, res) => res.send('Hello'));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name} `));

app.post('/api/articles/:name/upvote', async(req, res) => {
    try {
        const articleName = req.params.name;

        const client = await MongoClient.connect('mongodb://localhost:27017',  {useNewUrlParser: true} );
        const db = client.db('my-blog');        

        const articlesInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                upvotes : articlesInfo.upvotes +1 ,
            },           
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
    
        res.status(200).json(updatedArticleInfo);
    
        client.close();        
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error });         
    }
});
// app.post('/articles/:name/add-comment', (req, res) => {
//     const artikelName = req.params.name;
//     const {username, text} = req.body;
//     articlesInfo[artikelName].comments.push({username, text});
//     res.status(200).send(articlesInfo[artikelName]);
// });

app.get('/api/articles/:name', async(req, res) => {
  
    try {
        const articleName = req.params.name;

        const client = await MongoClient.connect('mongodb://localhost:27017',  {useNewUrlParser: true} );
        const db = client.db('my-blog');

        const articlesInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articlesInfo);

        client.close();
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error }); 
    }

});
app.listen(8000, () => console.log('Listening in Port 8000'));