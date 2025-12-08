import axios from "axios"

export const fetchProduct = async () => {
  try {
    const response = await axios.get('/api/products');
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};