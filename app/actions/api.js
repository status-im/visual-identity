import axios from 'axios';

const BASE_URL = 'localhost:3000';
export const appendCanvasLines = tx => {
  axios.post(`http://${BASE_URL}/addLines`, tx)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
