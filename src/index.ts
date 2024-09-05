import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import PinoHttp from 'pino-http';
import chat from './chain';
import { config } from './config';
import { saveVectorStore } from './embed';
import logger from './logger';

const app = express();
const port = config.port;

app.use(cors());
app.use(
  PinoHttp({
    logger,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', cors());

// Run once to populate vector store on startup
(async function runVectorStoreOneTime() {
  await saveVectorStore();
})();

// Run every FETCH_DATA_INTERVAL to update vector store
(async function initializeCronJobs() {
  cron.schedule(config.fetchDataInterval, async () => {
    try {
      await saveVectorStore();
    } catch (error) {
      logger.error(`Error while archiving probes: ${error}`);
    }
  });
})();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/chat', async (req, res) => {
  try {
    const question = req.body.question as string;
    const response = await chat(question);
    res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Indy ada masalah');
  }
});

app.get('/chat', async (req, res) => {
  const question = req.query.question as string;
  const response = await chat(question);
  res.send(response);
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
