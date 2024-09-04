"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const prompts_1 = require("@langchain/core/prompts");
const groq_1 = require("@langchain/groq");
const fetch_1 = __importDefault(require("./fetch"));
const llm = new groq_1.ChatGroq({
    apiKey: config_1.config.groqApiKey,
    modelName: config_1.config.modelName,
    temperature: config_1.config.temperature,
    maxTokens: config_1.config.maxTokens,
    maxRetries: config_1.config.maxRetries,
    streaming: config_1.config.streaming,
});
const template = `
  You are a helpful assistant from indorelawan. Your task is to help user choose the best activity based on their interests.
  Given the following extracted parts of a long document and a question, create a final answer.
  If you don't know the answer, just say that you don't know. Don't try to make up an answer.
  ALWAYS return a "CONTEXT" part in your answer.

  ========
  CONTEXT:
  {context}
  ========

  QUESTION: {question}
  =========
  ANSWER:
`;
const prompt = prompts_1.ChatPromptTemplate.fromTemplate(template);
const chain = prompt.pipe(llm);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const activities = yield (0, fetch_1.default)();
        console.log(activities);
        const res = yield chain.invoke({
            context: "The following is a conversation between a user and an AI assistant. The assistant gives helpful, detailed, and polite answers to the user's questions.",
            question: 'What is the best activity to do in indorelawan?',
        });
        console.log(res);
    });
}
main();
