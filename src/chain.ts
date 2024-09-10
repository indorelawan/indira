import { config } from './config';

import { ChatGroq } from '@langchain/groq';

import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

import { writeFileSync } from 'fs';
import path from 'node:path';
import { getVectorStore } from './embed';
import logger from './logger';
import getPrompt from './prompt';
import db, { THistory } from './db';
import getActivities from './fetch';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';

const llm = new ChatGroq({
  apiKey: config.groqApiKey,
  modelName: config.modelName,
  temperature: config.temperature,
  maxTokens: config.maxTokens,
  maxRetries: config.maxRetries,
  streaming: config.streaming,
});

async function chat(question: string, fingerprint: string) {
  // get history
  const history = await db.getHistory(fingerprint) || [];
  const composedHistory = history.map((item: THistory) => `Human: ${item.question}
AI: ${item.response}`);

  let composedPrompt, chain, docsSplit

  if (config.useEmbedding) {
    // Compose prompt
    composedPrompt = getPrompt(composedHistory);
    chain = await createStuffDocumentsChain({ llm: llm, prompt: composedPrompt });
  } else {
    logger.info('Getting activities...');
    const activities = await getActivities();

    const docs = activities.map(
      (activity: any) =>
        new Document({ pageContent: activity.pageContent, metadata: activity.metadata, id: activity.metadata.id })
    );

    logger.info('Splitting documents...');
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
    docsSplit = await splitter.splitDocuments(docs);
    // Compose prompt
    composedPrompt = getPrompt(composedHistory);
    chain = await createStuffDocumentsChain({ llm: llm, prompt: composedPrompt });
  }

  // get retriever
  const vectorStore = await getVectorStore();
  if (!vectorStore) {
    throw new Error('Vector store not found');
  }
  const retriever = vectorStore.asRetriever({
    k: 40
  });

  logger.info('Invoking chain...');
  const context = config.useEmbedding ? await retriever.invoke(question) : docsSplit
  // Debugging
  if (config.nodeENV !== 'production') {
    writeFileSync(path.resolve(__dirname, '../dev/context.txt'), config.useEmbedding ? JSON.stringify(context) : (docsSplit as Document<Record<string, any>>[]).join('\n\n'));
  }
  const res = await chain.invoke({
    history: composedHistory.join('\n\n'),
    input: question,
    context: context
  });

  // Add to History and make sure each user only has five history
  await db.addHistory(fingerprint, { question, response: res });

  // Prune old history
  if (history.length + 1 > 5) {
    await db.deleteOldestHistory(fingerprint);
  }

  // Debugging
  if (config.nodeENV !== 'production') {
    logger.info('Writing file...');
    const formattedPrompt = await composedPrompt.format({
      history: history.join('\n\n'),
      input: question,
      context
    });
    writeFileSync(path.resolve(__dirname, '../dev/prompt.txt'), formattedPrompt);
  }

  logger.info('Done!');
  return res;
}

export default chat;
