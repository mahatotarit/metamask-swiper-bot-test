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
require("log-timestamp");
const ethers_1 = require("ethers");
const http = __importStar(require("http"));
const burn_1 = __importDefault(require("./burn"));
const events_1 = require("events");
events_1.EventEmitter.defaultMaxListeners = 1000;
const main = (config_value) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a server
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World!\n');
    });
    const PORT = config_value.server_port;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    const RPC_URL = config_value.rpc_url;
    const VICTIM_KEY = config_value.target_wallet_private_key;
    function createProvider(rpc_url) {
        if (rpc_url.startsWith('https') || rpc_url.startsWith('http')) {
            return new ethers_1.providers.JsonRpcProvider(rpc_url);
        }
        else if (rpc_url.startsWith('wss') || rpc_url.startsWith('ws')) {
            return new ethers_1.providers.WebSocketProvider(rpc_url);
        }
        else {
            throw new Error('Unsupported RPC URL protocol');
        }
    }
    console.log('');
    const provider = createProvider(RPC_URL);
    console.log(`Connected to ${RPC_URL}`);
    const burnWallet = new ethers_1.Wallet(VICTIM_KEY, provider);
    yield provider.ready;
    console.log('Recipient address: ', config_value.recipient_address);
    provider.on('block', (blockNumber) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`[BLOCK ${blockNumber}]`);
        yield (0, burn_1.default)(burnWallet, config_value);
    }));
});
exports.default = main;
