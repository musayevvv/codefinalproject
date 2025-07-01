import axios from "axios";

// Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// GET
export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

// POST
export const postData = async (url, formData) => {
  try {
    const { data } = await axiosInstance.post(url, formData);
    return data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

// POST (FormData for image upload)
export const uploadImage = async (url, formData) => {
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Image Upload Error:", error);
    throw error;
  }
};

// PUT
export const editData = async (url, updatedData) => {
  try {
    const { data } = await axiosInstance.put(url, updatedData);
    return data;
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
};

// DELETE
export const deleteData = async (url) => {
  try {
    const { data } = await axiosInstance.delete(url);
    return data;
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
};

// DELETE (with body for image deletion)
export const deleteImages = async (url, image) => {
  try {
    const { data } = await axios.delete(`${import.meta.env.VITE_BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: image,
    });
    return data;
  } catch (error) {
    console.error("Image Delete Error:", error);
    throw error;
  }
};
