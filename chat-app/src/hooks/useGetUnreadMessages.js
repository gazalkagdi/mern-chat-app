import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import useConversation from "../zustand/useConversation";

const useGetUnreadMessages = () => {
  const [loading, setLoading] = useState(false);
  const { setUnreadConversations } = useConversation();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getUnreadMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/messages/unread`);
        const data = response.data;
        if (data.error) throw new Error(data.error);
        setUnreadConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUnreadMessages();
  }, [setUnreadConversations, apiBaseUrl]);

  return { loading };
};

export default useGetUnreadMessages;
