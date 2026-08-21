const axios = require('axios');
const MarketPrice = require('../models/MarketPrice');

// Note: You will need to generate a free API key from data.gov.in
const API_KEY = process.env.AGMARKNET_API_KEY || 'YOUR_FALLBACK_API_KEY'; 
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'; 

const fetchAndCacheBelagaviPrices = async () => {
    try {
        const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&filters[state]=Karnataka&filters[district]=Belgaum&limit=100`;
        const response = await axios.get(url);
        const records = response.data.records;

        if (!records || records.length === 0) return;

        // Clear yesterday's prices for Belgaum
        await MarketPrice.deleteMany({ market: 'Belgaum' });

        // Format and save today's prices
        const priceDocuments = records.map(record => ({
            commodity: record.commodity.toLowerCase().trim(),
            modalPrice: parseFloat(record.modal_price),
            market: 'Belgaum'
        }));

        await MarketPrice.insertMany(priceDocuments);
        console.log(`Successfully cached ${priceDocuments.length} commodity rates for Belagavi.`);
    } catch (error) {
        console.error("APMC Engine Error:", error.message);
    }
};

module.exports = { fetchAndCacheBelagaviPrices };