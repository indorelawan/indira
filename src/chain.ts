import { config } from './config';

import { ChatGroq } from '@langchain/groq';

import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

import { writeFileSync } from 'fs';
import path from 'node:path';
import { getVectorStore } from './embed';
import logger from './logger';
import getPrompt from './prompt';

const llm = new ChatGroq({
  apiKey: config.groqApiKey,
  modelName: config.modelName,
  temperature: config.temperature,
  maxTokens: config.maxTokens,
  maxRetries: config.maxRetries,
  streaming: config.streaming,
});
const history: string[] = [];

async function chat(question: string) {
  // Compose prompt
  const composedPrompt = getPrompt(history);
  const chain = await createStuffDocumentsChain({ llm: llm, prompt: composedPrompt });

  // get retriever
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever();

  logger.info('Invoking chain...');
  const res = await chain.invoke({
    history: history.join('\n\n'),
    input: question,
    context: await retriever.invoke(question),
  });

  history.push(`Human: ${question}
AI: ${res}`);

  if (history.length > 5) {
    history.slice(1, history.length - 1);
  }

  // Debugging
  logger.info('Writing file...');
  const formattedPrompt = await composedPrompt.format({
    history: history.join('\n\n'),
    input: question,
    context: await retriever.invoke(question),
  });
  writeFileSync(path.resolve(__dirname, '../dev/prompt.txt'), formattedPrompt);

  logger.info('Done!');
  return res;
}

export default chat;
