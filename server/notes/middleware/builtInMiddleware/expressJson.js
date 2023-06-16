


app.use(express.json())


// It is used to handle JSON data in the request body.
// When express.json() middleware is included in your application, 
// it intercepts requests with a Content-Type of application/json and parses the JSON data into a JavaScript object, making it accessible via req.body.