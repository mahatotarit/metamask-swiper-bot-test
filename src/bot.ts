import 'log-timestamp';
import { providers, Wallet } from 'ethers';

import * as http from 'http';

import burn from './burn';

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 1000;


const main = async (config_value: Record<string, any>) => {

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

  function createProvider(rpc_url: string) {
    if (rpc_url.startsWith('https') || rpc_url.startsWith('http')) {
      return new providers.JsonRpcProvider(rpc_url);
    } else if (rpc_url.startsWith('wss') || rpc_url.startsWith('ws')) {
      return new providers.WebSocketProvider(rpc_url);
    } else {
      throw new Error('Unsupported RPC URL protocol');
    }
  }

  console.log('');
  const provider = createProvider(RPC_URL);

  console.log(`Connected to ${RPC_URL}`);

  const burnWallet = new Wallet(VICTIM_KEY, provider);
  await provider.ready;

  console.log('Recipient address: ', config_value.recipient_address);

  provider.on('block', async (blockNumber) => {
    console.log(`[BLOCK ${blockNumber}]`);
    await burn(burnWallet,config_value);
  });

};

export default main;