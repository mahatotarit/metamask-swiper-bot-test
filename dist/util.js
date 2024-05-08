"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasPriceToGwei = void 0;
const GWEI = 1e9;
/** Returns human-readable gas price in gwei. */
const gasPriceToGwei = (gasPrice) => (gasPrice.mul(100).div(GWEI).toNumber() / 100);
exports.gasPriceToGwei = gasPriceToGwei;
