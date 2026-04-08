const axios = require('axios');
const FormData = require('form-data');
const { PINATA_KEY, PINATA_SECRET } = require('./index');

exports.pinBuffer = async (buffer) => {
  const data = new FormData();
  data.append('file', buffer);

  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    data,
    {
      headers: {
        ...data.getHeaders(),
        pinata_api_key: PINATA_KEY,
        pinata_secret_api_key: PINATA_SECRET
      }
    }
  );

  return res.data.IpfsHash;
};