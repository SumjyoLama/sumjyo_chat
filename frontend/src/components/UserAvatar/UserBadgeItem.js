import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      scrollPaddingRight={2}
      px={1}
      py={2}
      borderRadius="lg"
      margin={1}
      marginBottom={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon paddingLeft={1} />
    </Badge>
  );
};

export default UserBadgeItem;
