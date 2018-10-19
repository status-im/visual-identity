import axios from 'axios';

const BASE_URL = 'localhost:3000';
export const appendCanvasLines = tx => {
  const type = 'PURCHASE';
  axios.post(`http://${BASE_URL}/addLines`, { ...tx, type })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export const createSideChainAccount = tx => {
  const type = 'CREATE_ACCOUNT';
  axios.post(`http://${BASE_URL}/newAccount`, { ...tx, type })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
