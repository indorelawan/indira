import { config } from './config';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';
import getActivities from './fetch';

import { Document } from '@langchain/core/documents';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

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
  If you don't know the answer, Always ask for user preferences. Don't try to make up an answer.
  

  ========
  CONTEXT: {context}
  ========
  QUESTION: {input}
  ========
  ANSWER:
`;

const prompt = ChatPromptTemplate.fromTemplate(template);

// const chain = prompt.pipe(llm);

async function chat(question: string) {
  const activities = await getActivities();

  const docs = activities.map(
    (activity: any) =>
      new Document({ pageContent: activity.pageContent, metadata: activity.metadata, id: activity.metadata.id })
  );

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
  const docsSplit = await splitter.splitDocuments(docs);

  const chain = await createStuffDocumentsChain({ llm: llm, prompt: prompt });

  const res = await chain.invoke({ input: question, context: docsSplit });

  return res;
}

export default chat;
