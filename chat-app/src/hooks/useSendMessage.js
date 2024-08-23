import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/messages/send/${selectedConversation._id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
