"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.config = {
    groqApiKey: (_a = process.env.GROQ_API_KEY) !== null && _a !== void 0 ? _a : '',
    modelName: (_b = process.env.MODEL_NAME) !== null && _b !== void 0 ? _b : '',
    temperature: parseFloat((_c = process.env.TEMPERATURE) !== null && _c !== void 0 ? _c : '0.3'),
    maxTokens: parseInt((_d = process.env.MAX_TOKENS) !== null && _d !== void 0 ? _d : '1024'),
    maxRetries: parseInt((_e = process.env.MAX_RETRIES) !== null && _e !== void 0 ? _e : '3'),
    streaming: process.env.STREAMING === 'true',
    activityUrl: (_f = process.env.ACTIVITY_URL) !== null && _f !== void 0 ? _f : '',
};
