const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const uri = "mongodb+srv://swift:swift@cluster0.h4bqimr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

const db = client.db("app03");
const productsCollection = db.collection('products');

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await productsCollection.find().toArray();
        console.log(products)
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create a new product
app.post('/products', async (req, res) => {
    try {
        const result = await productsCollection.insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
    try {
        const result = await productsCollection.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { returnOriginal: false }
        );
        if (result.value) {
            res.json(result.value);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const result = await productsCollection.deleteOne({ id: new req.params.id });
        if (result.deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
