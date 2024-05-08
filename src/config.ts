import bot_fun from "./bot";


export let variables_pre: Record<string, any> | null | undefined;

const config = async (variables: Record<string, any>) => {
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
    if (
      !(opt.key in variables) ||
      variables[opt.key] === undefined ||
      variables[opt.key] === null
    ) {
      variables[opt.key] = opt.defaultValue;
    }
  });

  required_variables.forEach((key) => {
    if (
      !(key in variables) ||
      variables[key] === undefined ||
      variables[key] === null
    ) {
      console.log(`Please provide ${key} value.`);
      return;
    } else {
      console.log(variables[key]);
    }
  });

  variables_pre = variables;

};

const start = async() => {
  if(variables_pre != null || variables_pre != undefined){
    bot_fun(variables_pre);
  } else{
    console.log('Please configure the bot details');
  }
}


export { config , start };
