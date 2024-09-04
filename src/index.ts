import express from 'express';
import chat from './chain';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/chat', async (req, res) => {
  const question = req.query.question as string;
  const response = await chat(question);
  res.send(response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
