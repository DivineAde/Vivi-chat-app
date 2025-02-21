import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Text,
  useDisclosure,
  Image,
  Box,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { PiDotsThreeOutlineVerticalLight, PiPhoneLight } from "react-icons/pi";
import { CiVideoOn } from "react-icons/ci";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Box display={"flex"} alignItems={"center"} gap={"2px"}>
          <CiVideoOn size={22} />
          <PiPhoneLight size={22} />
          <PiDotsThreeOutlineVerticalLight  size={22}
            className="flex cursor-pointer"
            onClick={onOpen} />
        </Box>
      )}

      <Modal size="md" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>My profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent=""
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text fontWeight={"medium"}>{user.name}</Text>
            <Text fontWeight={"semibold"} fontSize={{ base: "20px", md: "22px" }}>
              {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blackAlpha" variant='outline' borderRadius={"lg"} mr={3} onClick={onClose}>
             close
            </Button>
            <Button colorScheme="black" variant='outline' boxShadow='base' rounded={"lg"} mr={3} onClick={onClose}>
              save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
