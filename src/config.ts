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
  baseUrl: string;
  port: number;
  nodeENV: string;
}

export const config: Config = {
  groqApiKey: process.env.GROQ_API_KEY ?? '',
  modelName: process.env.MODEL_NAME ?? '',
  temperature: parseFloat(process.env.TEMPERATURE ?? '0.3'),
  maxTokens: parseInt(process.env.MAX_TOKENS ?? '1024'),
  maxRetries: parseInt(process.env.MAX_RETRIES ?? '3'),
  streaming: process.env.STREAMING === 'true',
  activityUrl: process.env.ACTIVITY_URL ?? '',
  baseUrl: process.env.BASE_URL ?? '',
  port: parseInt(process.env.PORT ?? '3001'),
  nodeENV: process.env.NODE_ENV ?? 'development',
};
