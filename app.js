const http = require('http');
const axios = require('axios');
const { MongoClient } = require('mongodb');

async function getEmbedding(query) {
    // Define the OpenAI API url and key.
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = '<OpenAI key>'; // Replace with your OpenAI key.
    
    // Call OpenAI API to get the embeddings.
    let response = await axios.post(url, {
        input: query,
        model: "text-embedding-ada-002"
    }, {
        headers: {
            'Authorization': `Bearer ${openai_key}`,
            'Content-Type': 'application/json'
        }
    });
    
    if(response.status === 200) {
	console.log(response.data.data[0].embedding);
        return response.data.data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
}

async function findSimilarDocuments(embedding) {
    
    const url = "mongodb+srv://faizalrubm:<password>@cluster0.sg1d3ag.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        
        const db = client.db('sample_mflix'); // Replace with your database name.
        const collection = db.collection('embedded_movies'); // Replace with your collection name.
        
        // Query for similar documents.
        const documents = await collection.aggregate([
            {
            "$search": {
            "index": "default",
            "knnBeta": {
            "vector": embedding,
            "path": "plot_embedding",
            "k": 5
            }
            }
            }
            ]).toArray();
        console.log(documents);        
        return documents;
    } finally {
        await client.close();
    }
}


// Define your main function
async function main() {
    // Your main function code here
    console.log('Main function called');
    	
    const query = 'Young Pauline'; // Replace with your query.
    let result = ''; // Store the results as a string.
    
    try {
        const embedding = await getEmbedding(query);
        const documents = await findSimilarDocuments(embedding);
        // Convert the documents array to a string and store it in the result variable.
        result = JSON.stringify(documents);
        console.log(result);
    } catch(err) {
        console.error(err);
        result = `Main function failed: ${err.message}`;
    }
    return result; // Return the result as a string.	
}

// Create an HTTP server
const hostname = '127.0.0.1';
const port = 3000;

// Define an async function to start the server
async function startServer() {
    const server = http.createServer(async (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html'); // Set the content type to HTML.

        // Check the URL to determine if main should be called
        if (req.url === '/call-main') {
            const result = await main(); // Call the main function and await the result.

            // Create an HTML response with the result embedded.
            const htmlResponse = `
                <html>
                <head>
                    <title>Results</title>
                </head>
                <body>
                    <h1>Results</h1>
                    <pre>${result}</pre>
                </body>
                </html>
            `;

            res.end(htmlResponse); // Send the HTML response with the results.
        } else {
            res.end('Begin Code Execution');
        }
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

// Call the async function to start the server
startServer().catch((err) => {
    console.error(err);
});
