import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import getActivities from './fetch';
import logger from './logger';

let VectorStore: MemoryVectorStore | null;

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

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: 'Xenova/all-MiniLM-L6-v2',
    });

    logger.info('Creating vector store...');
    VectorStore = await MemoryVectorStore.fromDocuments(docsSplit, embeddings)
    logger.info('Successfully saved vector store');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save vector store');
  }
}

export async function getVectorStore() {
  return VectorStore
}
