const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const API_BASE_URL = 'https://api-sandbox.circle.com/v1';
const API_KEY = process.env.API_KEY;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});

const createWallet = async () => {
    try {
        const response = await axiosInstance.post('/wallets', {
            idempotencyKey: crypto.randomBytes(16).toString('hex'),
            type: 'end_user_wallet'
        });
        return response.data;
    } catch (error) {
        console.error('Error creating wallet:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const generateEntitySecret = async () => {
    try {
        const response = await axiosInstance.post('/wallets/keys', {
            idempotencyKey: crypto.randomBytes(16).toString('hex'),
        });
        return response.data;
    } catch (error) {
        console.error('Error generating entity secret:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const makeTransaction = async (sourceWalletId, destinationAddress, amount, token) => {
    try {
        const response = await axiosInstance.post('/transfers', {
            idempotencyKey: crypto.randomBytes(16).toString('hex'),
            source: {
                type: 'wallet',
                id: sourceWalletId
            },
            destination: {
                type: 'blockchain',
                address: destinationAddress
            },
            amount: {
                amount: amount.toString(),
                currency: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error making transaction:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getWalletBalance = async (walletId) => {
    try {
        const response = await axiosInstance.get(`/wallets/${walletId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting wallet balance:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = {
    createWallet,
    generateEntitySecret,
    makeTransaction,
    getWalletBalance
};
