import User from "../models/user.js";
import Conversation from "../models/conversations.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Get all conversations for the logged-in user
    const conversations = await Conversation.find({
      participants: loggedInUserId,
    }).sort({ updatedAt: -1 });

    const participantIds = conversations.reduce((acc, conv) => {
      const otherParticipant = conv.participants.find(
        (id) => id.toString() !== loggedInUserId.toString(),
      );
      if (otherParticipant) acc.push(otherParticipant);
      return acc;
    }, []);

    // Get users who have a conversation with the logged-in user, in order of recent activity
    const usersWithConversations = await User.find({
      _id: { $in: participantIds },
    }).select("-password");

    // Reorder users to match conversation activity
    const orderedUsersWithConversations = participantIds
      .map((id) =>
        usersWithConversations.find((u) => u._id.toString() === id.toString()),
      )
      .filter(Boolean);

    // Get remaining users who don't have a conversation yet
    const otherUsers = await User.find({
      _id: { $ne: loggedInUserId, $nin: participantIds },
    }).select("-password");

    const finalUsers = [...orderedUsersWithConversations, ...otherUsers];

    res.status(200).json(finalUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
