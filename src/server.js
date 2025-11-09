import express from 'express';
import {config} from 'dotenv';
import studentRouter from './routes/studentRoutes.js';

config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(studentRouter);
app.use((req,res) => {
    res.status(404).send('Not Found')
})


app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));
