import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import PinoHttp from 'pino-http';
import chat from './chain';
import { config } from './config';
import { getFingerprint } from './utils'
import { saveVectorStore } from './embed';
import logger from './logger';
import db from './db';

const app = express();
const port = config.port;

app.use(cors({
  credentials: true,
  origin: true,
}));
app.use(PinoHttp({
  logger,
}))
app.use(cors());
app.use(
  PinoHttp({
    logger,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, _, next) => {
  const fingerprint = getFingerprint(req);
  req.sessionID = fingerprint

  next()
})

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
    const fingerprint = req.sessionID;
    const question = req.body.question as string;
    const response = await chat(question, fingerprint);
    res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Indy ada masalah');
  }
});

app.get('/chat', async (req, res) => {
  try {
    const fingerprint = req.sessionID
    const question = req.query.question as string;
    const response = await chat(question, fingerprint);
    res.send(response);
  } catch (error) {
    console.log(error)
    return res.status(500).send('Indy ada masalah')
  }
});

app.listen(port, async () => {
  // Create tables
  await db.createTables();

  logger.info(`Example app listening at http://localhost:${port}`);
});
