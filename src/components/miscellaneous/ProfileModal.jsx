import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, Image, Button, useDisclosure, Avatar,
} from "@chakra-ui/react";
import { CiVideoOn } from "react-icons/ci";
import { PiDotsThreeOutlineVerticalLight, PiPhoneLight } from "react-icons/pi";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <div className="flex items-center gap-1.5 text-gray-500">
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <CiVideoOn size={20} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <PiPhoneLight size={20} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" onClick={onOpen}>
            <PiDotsThreeOutlineVerticalLight size={20} />
          </button>
        </div>
      )}

      <Modal size="sm" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.400" />
        <ModalContent rounded="2xl" shadow="2xl" border="none">
          <ModalHeader fontSize="md" fontWeight="600">Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar size="2xl" name={user?.name} src={user?.pic} shadow="lg" />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              </div>
              <Button
                onClick={onClose}
                colorScheme="blue"
                rounded="xl"
                size="sm"
                w="full"
                mt={2}
              >
                Close
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
