import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
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
