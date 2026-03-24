import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      onClick={handleFunction}
      className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full px-2.5 py-1 m-1 cursor-pointer hover:bg-blue-200 transition-colors"
    >
      {user.name}
      {admin?._id === user._id && <span className="text-[10px] ml-0.5 opacity-70">(admin)</span>}
      <CloseIcon boxSize={2} ml={0.5} />
    </span>
  );
};

export default UserBadgeItem;