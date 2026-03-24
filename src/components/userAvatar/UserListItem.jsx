import { Avatar } from "@chakra-ui/avatar";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group"
    >
      <Avatar size="sm" name={user?.name} src={user?.pic} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
          {user?.name}
        </p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;