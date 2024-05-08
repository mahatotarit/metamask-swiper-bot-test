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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const util_1 = require("./util");
const { formatEther } = ethers_1.utils;
const burn = (burnWallet, config_de_value) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield burnWallet.getBalance();
    if (balance.isZero()) {
        console.log(`Balance is zero`);
        return;
    }
    const gasPrice = (yield burnWallet.getGasPrice()).add(ethers_1.utils.parseUnits((config_de_value.extra_gas_fee + "").trim(), 'gwei'));
    let gas_fee_in_et = gasPrice.mul(config_de_value.gas_limit);
    if (balance.lt(gas_fee_in_et)) {
        console.log(`🔻 Balance [${ethers_1.ethers.utils.formatEther(balance)}] is very low for gas price: ${(0, util_1.gasPriceToGwei)(gasPrice)} gwei [${ethers_1.ethers.utils.formatEther(gas_fee_in_et)}]`);
        return;
    }
    const leftovers = balance.sub(gasPrice.mul(config_de_value.gas_limit));
    try {
        console.log(`🔥 Burning: ${formatEther(balance)}`);
        const nonce = yield burnWallet.provider.getTransactionCount(burnWallet.address);
        const tx = yield burnWallet.sendTransaction({
            to: config_de_value.recipient_address,
            gasLimit: config_de_value.gas_limit,
            gasPrice,
            nonce,
            value: leftovers,
        });
        console.log('🚀 Transactions submitted');
        console.log(`📲 Transfer: ${formatEther(leftovers)}`);
        const receipt = yield tx.wait();
        const txHash = receipt.transactionHash;
        console.log('✅ Tx hash - ' + txHash);
        const amount = formatEther(leftovers);
        const bot_token = config_de_value.telegram_bot_token;
        const telegram_id = config_de_value.telegram_user_id;
        const tx_hash = txHash;
    }
    catch (err) {
        if (err.code === 'REPLACEMENT_UNDERPRICED', err.code === 'INSUFFICIENT_FUNDS') {
            console.log('Gas fee too low. Transaction may fail. 😔');
        }
        else {
            console.log('Error sending transaction:' + '😱');
        }
    }
});
exports.default = burn;
