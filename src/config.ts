import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  groqApiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  maxRetries: number;
  streaming: boolean;
  activityUrl: string;
  port: number;
  nodeENV: string;
  sessionSecret: string;
  baseUrl: string;
  embeddingModel: string;
  fetchDataInterval: string;
  useEmbedding: boolean;
}

export const config: Config = {
  groqApiKey: process.env.GROQ_API_KEY ?? '',
  modelName: process.env.MODEL_NAME || 'llama-3.1-70b-versatile',
  temperature: parseFloat(process.env.TEMPERATURE ?? '0.3'),
  maxTokens: parseInt(process.env.MAX_TOKENS ?? '1024'),
  maxRetries: parseInt(process.env.MAX_RETRIES ?? '3'),
  streaming: process.env.STREAMING === 'true',
  activityUrl: process.env.ACTIVITY_URL ?? '',
  port: parseInt(process.env.PORT ?? '3001'),
  nodeENV: process.env.NODE_ENV ?? 'development',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3001',
  sessionSecret: process.env.SESSION_SECRET ?? 'Th1s-n33dS-to-b3-S3kr3t',
  embeddingModel: process.env.EMBEDDING_MODEL ?? 'Xenova/all-MiniLM-L6-v2',
  fetchDataInterval: process.env.FETCH_DATA_INTERVAL ?? '* */1 * * *',
  useEmbedding: process.env.USE_EMBEDDING === 'true',
};
