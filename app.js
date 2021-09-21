import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';

const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('Api is working');
});
routes(app);

app.listen(3000, () => {
  console.log('server is runnng in 3000');
});

export default app;
