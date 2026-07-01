import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const {
    selectedConversation,
    setSelectedConversation,
    unreadConversations,
    setUnreadConversations,
  } = useConversation();

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);
  const isSelected = selectedConversation?._id === conversation._id;
  const isUnread = unreadConversations.includes(conversation._id);

  const handleSelectConversation = () => {
    setSelectedConversation(conversation);
    if (isUnread) {
      setUnreadConversations(
        unreadConversations.filter((id) => id !== conversation._id),
      );
    }
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-500" : ""}
			`}
        onClick={handleSelectConversation}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img
              src="/user.png"
              alt="user avatar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
            <div className="flex items-center gap-1">
              <span className="text-xl">{emoji}</span>
              {isUnread && (
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};
export default Conversation;
