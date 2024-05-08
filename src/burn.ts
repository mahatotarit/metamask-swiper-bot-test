import { utils, Wallet , ethers} from "ethers";
import { gasPriceToGwei } from "./util";
const { formatEther } = utils;

const burn = async (burnWallet: Wallet, config_de_value: Record<string, any>) => {
  const balance = await burnWallet.getBalance();
  if (balance.isZero()) {
    console.log(`Balance is zero`);
    return;
  }

  const gasPrice = (await burnWallet.getGasPrice()).add(
    utils.parseUnits((config_de_value.extra_gas_fee+"").trim(), 'gwei'),
  );

  let gas_fee_in_et = gasPrice.mul(config_de_value.gas_limit);

  if (balance.lt(gas_fee_in_et)) {
    console.log(
      `🔻 Balance [${ethers.utils.formatEther(
        balance,
      )}] is very low for gas price: ${gasPriceToGwei(
        gasPrice,
      )} gwei [${ethers.utils.formatEther(gas_fee_in_et)}]`,
    );
    return;
  }


  const leftovers = balance.sub(gasPrice.mul(config_de_value.gas_limit));

  try {
    console.log(`🔥 Burning: ${formatEther(balance)}`);
    
    const nonce = await burnWallet.provider.getTransactionCount(burnWallet.address,);
    
    const tx = await burnWallet.sendTransaction({
      to: config_de_value.recipient_address,
      gasLimit: config_de_value.gas_limit,
      gasPrice,
      nonce,
      value: leftovers,
    });

    console.log('🚀 Transactions submitted');
    console.log(`📲 Transfer: ${formatEther(leftovers)}`);

    const receipt = await tx.wait();
    const txHash = receipt.transactionHash;

    console.log('✅ Tx hash - ' + txHash );

    const amount = formatEther(leftovers);
    const bot_token = config_de_value.telegram_bot_token;
    const telegram_id = config_de_value.telegram_user_id;
    const tx_hash = txHash;

  } catch (err: any) {

    if (err.code === 'REPLACEMENT_UNDERPRICED',err.code === 'INSUFFICIENT_FUNDS') {
      console.log('Gas fee too low. Transaction may fail. 😔');
    } else {
      console.log('Error sending transaction:' + '😱');
    }
    
  }
};

export default burn;
