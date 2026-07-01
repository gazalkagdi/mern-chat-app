import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout.js";
import useConversation from "../../zustand/useConversation.js";

const LogoutButton = () => {
  const { loading, logout } = useLogout();
  const { setSelectedConversation } = useConversation();

  const handleLogout = async () => {
    localStorage.removeItem("selected-conversation");
    setSelectedConversation(null);
    await logout();
  };

  return (
    <div className="mt-auto">
      {!loading ? (
        <BiLogOut
          className="w-6 h-6 text-white cursor-pointer hover:text-sky-500 transition-colors"
          onClick={handleLogout}
        />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
    </div>
  );
};
export default LogoutButton;
