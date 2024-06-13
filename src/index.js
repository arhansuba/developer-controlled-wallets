const {
    createWallet,
    generateEntitySecret,
    makeTransaction,
    getWalletBalance
} = require('./helper_functions');
require('dotenv').config();

const fs = require('fs');

const updateEnvFile = (envConfig) => {
    const envVariables = Object.entries(envConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    fs.writeFileSync('.env', envVariables);
};

const run = async () => {
    try {
        // Step 1: Generate Entity Secret
        const entitySecretData = await generateEntitySecret();
        const entitySecret = entitySecretData.data.secret;
        const ciphertext = entitySecretData.data.encryptedSecret;

        console.log('Entity Secret:', entitySecret);
        console.log('Ciphertext:', ciphertext);

        // Step 2: Create Wallet 1
        const wallet1 = await createWallet();
        console.log('Wallet 1:', wallet1);
        const walletId1 = wallet1.data.walletId;
        const walletAddress1 = wallet1.data.addresses[0].address;

        // Step 3: Create Wallet 2
        const wallet2 = await createWallet();
        console.log('Wallet 2:', wallet2);
        const walletId2 = wallet2.data.walletId;
        const walletAddress2 = wallet2.data.addresses[0].address;

        // Update .env file
        const envConfig = {
            API_KEY: process.env.API_KEY,
            ENTITY_SECRET: entitySecret,
            WALLET_SET_ID: process.env.WALLET_SET_ID,
            WALLET_ID_1: walletId1,
            WALLET_ID_2: walletId2,
            WALLET_ADDRESS_1: walletAddress1,
            WALLET_ADDRESS_2: walletAddress2,
            USDC_TOKEN_ID: process.env.USDC_TOKEN_ID,
        };

        updateEnvFile(envConfig);

        // Step 4: Obtain test tokens for WALLET_ADDRESS_1 from a faucet

        // Step 5: Make a transaction from Wallet 1 to Wallet 2
        const transaction = await makeTransaction(
            walletId1,
            walletAddress2,
            1, // Amount in USDC (for example, 1 USDC)
            process.env.USDC_TOKEN_ID
        );
        console.log('Transaction:', transaction);

        // Step 6: Confirm transaction and check wallet balances
        const wallet1Balance = await getWalletBalance(walletId1);
        const wallet2Balance = await getWalletBalance(walletId2);

        console.log('Wallet 1 Balance:', wallet1Balance);
        console.log('Wallet 2 Balance:', wallet2Balance);

    } catch (error) {
        console.error('Error running the script:', error);
    }
};

run();
