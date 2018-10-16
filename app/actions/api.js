import axios from 'axios';

const BASE_URL = 'localhost:3000';
export const appendCanvasLines = canvasLines => {
  axios.post(`http://${BASE_URL}/addLines`, { canvasLines })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
