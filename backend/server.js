import express from 'express';
import path from 'path';
import products from './routes/products.js';
import cors from 'cors'
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
import connectDB from './database/mongoDB.js';
import dotenv from "dotenv"
dotenv.config()

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();


// Enable CORS for all origins
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

// setup static folder

// Routes
app.use('/api/products', products);


if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get("*", (req,res) =>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}
// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
connectDB()
console.log(`Server is running on port ${port}`)
});
    
