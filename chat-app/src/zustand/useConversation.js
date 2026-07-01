import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation:
    JSON.parse(localStorage.getItem("selected-conversation")) || null,
  setSelectedConversation: (selectedConversation) => {
    localStorage.setItem(
      "selected-conversation",
      JSON.stringify(selectedConversation),
    );
    set({ selectedConversation });
  },
  messages: [],
  setMessages: (messages) => set({ messages }),
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  unreadConversations: [],
  setUnreadConversations: (unreadConversations) => set({ unreadConversations }),
}));

export default useConversation;
