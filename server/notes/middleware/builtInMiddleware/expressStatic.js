
// express.static a built in middleware

// in server.js

app.use('/', express.static(path.join(__dirname, 'public')))


// this can work as well
// ''public' is in relative path ./public 
app.use(express.static('public'))