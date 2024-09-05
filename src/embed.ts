import { Document } from '@langchain/core/documents';
import { OllamaEmbeddings } from '@langchain/ollama';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { config } from './config';
import getActivities from './fetch';
import logger from './logger';

export async function saveVectorStore() {
  try {
    logger.info('Getting activities...');
    const activities = await getActivities();

    const docs = activities.map(
      (activity: any) =>
        new Document({ pageContent: activity.pageContent, metadata: activity.metadata, id: activity.metadata.id })
    );

    logger.info('Splitting documents...');
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
    const docsSplit = await splitter.splitDocuments(docs);

    const embeddings = new OllamaEmbeddings({
      model: config.embeddingModel,
    });

    logger.info('Creating vector store...');
    await MemoryVectorStore.fromDocuments(docsSplit, embeddings);
    logger.info('Successfully saved vector store');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save vector store');
  }
}

export async function getVectorStore() {
  try {
    const vectorStore = await MemoryVectorStore.fromExistingIndex(
      new OllamaEmbeddings({
        model: config.embeddingModel,
      })
    );

    return vectorStore;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get vector store');
  }
}
