import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  axios.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("chat-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/users`);
        const data = response.data;

        if (data.error) {
          throw new Error(data.error);
        }

        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
