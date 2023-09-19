# mongo-vector-search-openai
Vector search demo in mongo using OpenAI embedding



# MongoDB Atlas cluster setup instructions (cloud)

1) Create Cluster (M0 tier cluster)
2) From Collections tab, load sample dataset
3) Verify that sample_mfix database and embedded_movies collections are created
4) From Search tab, create index on sample_mflix.embedded_movies. Use JSON Editor with following code snippet. 

{
  "mappings": {
    "dynamic": true,
    "fields": {
      "plot_embedding": {
        "dimensions": 1536,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}


# Node.js application setup instructions (Local)

1) Install latest version of node.js 
brew install node

2) Install modules axis, mongodb
npm install axis
npm install mongodb

3) Modify the app.js file to replace <OpenAI key> and MongoDB <url> 
4) Download the app.js file and run the application 
node app.js

5) In the browser, invoke following url to invoke the vector search and view the results. 
http://127.0.0.1:3000/call-main

 

 
