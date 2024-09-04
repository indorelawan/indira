import { config } from './config';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';
import getActivities from './fetch';

const llm = new ChatGroq({
  apiKey: config.groqApiKey,
  modelName: config.modelName,
  temperature: config.temperature,
  maxTokens: config.maxTokens,
  maxRetries: config.maxRetries,
  streaming: config.streaming,
});

const template = `
  You are a helpful assistant from indorelawan. Your task is to help user choose the best activity based on their interests.
  Given the following extracted parts of a long document and a question, create a final answer.
  If you don't know the answer, just say that you don't know. Don't try to make up an answer.

  ========
  CONTEXT: {context}
  ========
  QUESTION: {question}
  ========
  ANSWER:
`;

const prompt = ChatPromptTemplate.fromTemplate(template);

const chain = prompt.pipe(llm);

async function chat(question: string) {
  const activities = await getActivities();
  //   console.log(JSON.stringify(activities, null, 2));
  const res = await chain.invoke({
    context: JSON.stringify(JSON.stringify(activities, null, 2)),
    question: question,
  });

  return res;
}

import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/chat', async (req, res) => {
  const question = req.query.question as string;
  const response = await chat(question);
  res.send(response.content);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
