import axios from 'axios';

const BASE_URL = 'localhost:3000';
const type = 'PURCHASE';
export const appendCanvasLines = tx => {
  axios.post(`http://${BASE_URL}/addLines`, { ...tx, type })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
