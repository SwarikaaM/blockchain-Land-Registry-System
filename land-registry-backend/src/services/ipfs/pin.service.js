const axios = require('axios');
const FormData = require('form-data');

exports.pinBuffer = async (buffer) => {
  try {
    const data = new FormData();
    data.append('file', buffer, {
      filename: 'file.pdf'
    });

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          pinata_api_key: process.env.PINATA_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET
        }
      }
    );

    return res.data.IpfsHash;

  } catch (err) {
    console.error("IPFS Error:", err.response?.data || err.message);
    throw err;
  }
};