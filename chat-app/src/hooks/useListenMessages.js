import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const {
    messages,
    setMessages,
    selectedConversation,
    unreadConversations,
    setUnreadConversations,
  } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();

      if (selectedConversation?._id === newMessage.senderId) {
        setMessages([...messages, newMessage]);
      } else {
        if (!unreadConversations.includes(newMessage.senderId)) {
          setUnreadConversations([...unreadConversations, newMessage.senderId]);
        }
      }
    });

    return () => socket?.off("newMessage");
  }, [
    socket,
    setMessages,
    messages,
    selectedConversation,
    unreadConversations,
    setUnreadConversations,
  ]);
};
export default useListenMessages;
