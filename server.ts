import app from './src/routes';

const port = process.env.PORT
app.listen(port)
console.log("Api Chat Online", 'Na porta', port);