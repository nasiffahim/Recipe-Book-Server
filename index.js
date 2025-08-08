const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tur8sdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  console.log("connected to mongodb");
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
    const recipeCollection = client.db('recipeBookDB').collection('recipes');

    app.get('/recipes', async (req, res) => {
        const cursor = recipeCollection.find();
        const recipes = await cursor.toArray();
        res.send(recipes);
    });

    app.get('/recipes/by-likes', async (req, res) => {
    try {
        // Sort by likes in descending order (-1) and limit to 6 results
        const cursor = recipeCollection.find()
            .sort({ likes: -1 })  // Sort by likes (highest first)
            .limit(6);            // Limit to top 6 results
        
        const recipes = await cursor.toArray();
        res.send(recipes);
      } catch (error) {
          console.error('Error fetching top recipes:', error);
          res.status(500).json({ error: 'Failed to fetch recipes' });
      }
    });

    app.get('/my-recipes', async (req, res) => {
        const userEmail = req.query.email;

        let query = {};
        if (userEmail) {
            query.email = userEmail;
        }

        const cursor = recipeCollection.find(query);
        const recipes = await cursor.toArray();
        res.send(recipes);
    });


    app.post('/recipes', async (req, res) => {
        const newRecipes = req.body;
        newRecipes.likes = 0;
        const result = await recipeCollection.insertOne(newRecipes);
        res.send(result);
    });

    app.delete('/recipes/:id', async (req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await recipeCollection.deleteOne(query);
        res.send(result);
    })

    app.put('/recipes/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedrecipe = req.body; 
        delete updatedrecipe._id;
        
        const updateDoc = {
          $set: updatedrecipe
        }

        const result = await recipeCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    app.patch('/recipes/:id/like', async (req, res) => {
      const recipeId = req.params.id;
      try {
          const result = await recipeCollection.updateOne(
              { _id: new ObjectId(recipeId) },
              { $inc: { likes: 1 } }
          );
          res.send(result);
      } catch (error) {
          res.status(500).send({ message: 'Failed to like recipe' });
      }
    });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});