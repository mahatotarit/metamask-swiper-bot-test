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
exports.start = exports.config = exports.variables_pre = void 0;
const bot_1 = __importDefault(require("./bot"));
const config = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof variables !== 'object') {
        console.log('Please provide credentials details in object format.');
        return;
    }
    let required_variables = [
        'rpc_url',
        'target_wallet_private_key',
        'recipient_address',
        'telegram_user_id',
        'telegram_bot_token',
    ];
    let optionals_variable = [
        { key: 'server_port', defaultValue: 8080 },
        { key: 'extra_gas_fee', defaultValue: 0 },
        { key: 'gas_limit', defaultValue: 21000 },
    ];
    optionals_variable.forEach((opt) => {
        if (!(opt.key in variables) ||
            variables[opt.key] === undefined ||
            variables[opt.key] === null) {
            variables[opt.key] = opt.defaultValue;
        }
    });
    required_variables.forEach((key) => {
        if (!(key in variables) ||
            variables[key] === undefined ||
            variables[key] === null) {
            console.log(`Please provide ${key} value.`);
            return;
        }
        else {
            console.log(variables[key]);
        }
    });
    exports.variables_pre = variables;
});
exports.config = config;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.variables_pre != null || exports.variables_pre != undefined) {
        (0, bot_1.default)(exports.variables_pre);
    }
    else {
        console.log('Please configure the bot details');
    }
});
exports.start = start;
