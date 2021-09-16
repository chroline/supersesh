import React, { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  HighlightOffRounded,
  PersonRounded,
  ShareRounded,
  VerifiedUserRounded,
  VolumeUpRounded,
} from "@material-ui/icons";
import { useRouter } from "next/router";

import { Logo } from "~/client/core/components/Logo";
import { APIService } from "~/client/ctrl/api";
import { SessionDataService } from "~/client/ctrl/session-data";
import { SidebarButton } from "~/client/session-page/components/SidebarButton";

export const Sidebar: React.FC = () => {
  const router = useRouter(),
    sessionID = router.query.sessionID as string;
  const session = SessionDataService.getSessionData();

  const { colorMode } = useColorMode();

  const isModalCentered = useBreakpointValue({ base: true, md: false });
  const isAdmin = localStorage.getItem("name") === SessionDataService.getSessionData()?.adminID;

  // invite some friends
  const { isOpen: isInviteModalOpen, onOpen: openInviteModal, onClose: closeInviteModal } = useDisclosure();

  // listen to lofi beats
  function listenToLofiBeats() {
    window.open(
      "https://open.spotify.com/embed/playlist/7it4DybEQp3XHpmwXgMgz0?theme=0",
      "targetWindow",
      `width=400,height=600`
    );
  }

  // end session
  const { isOpen: isEndModalOpen, onOpen: openEndModal, onClose: closeEndModal } = useDisclosure(),
    cancelEndBtnRef = useRef();
  async function endSession() {
    await APIService.endSession(sessionID);
    closeEndModal();
    router.push("/");
  }

  return (
    <>
      <VStack
        overflowY={"scroll"}
        align={"center"}
        h={"full"}
        w={"full"}
        flexShrink={0}
        bg={{ dark: "warmGray.900", light: "warmGray.50" }[colorMode]}
        p={6}
        spacing={6}
        divider={<Divider borderColor={{ dark: "warmGray.700", light: "warmGray.200" }[colorMode]} />}
      >
        <VStack>
          <Heading as={"p"} size={"xl"}>
            <Logo />
          </Heading>
          {session && <Text fontWeight={"semibold"}>“{session!.name}”</Text>}
        </VStack>
        <VStack w={"full"}>
          <Text opacity={0.6} fontSize={"sm"} fontWeight={"bold"} w={"full"} ml={6}>
            ACTIONS
          </Text>
          <SidebarButton icon={ShareRounded} color={"lightBlue"} onClick={openInviteModal}>
            invite some friends
          </SidebarButton>
          <SidebarButton icon={VolumeUpRounded} color={"green"} onClick={listenToLofiBeats}>
            listen to lofi beats
          </SidebarButton>
          {isAdmin && (
            <SidebarButton icon={HighlightOffRounded} color={"red"} onClick={openEndModal}>
              end sesh
            </SidebarButton>
          )}
        </VStack>
        <VStack w={"full"}>
          <Text opacity={0.6} fontSize={"sm"} fontWeight={"bold"} w={"full"} ml={6}>
            CURRENT USERS
          </Text>
          <SidebarButton icon={VerifiedUserRounded} color={"emerald"}>
            {session!.adminID}
          </SidebarButton>
          {session!.userIDs.map(userID => (
            <SidebarButton
              icon={PersonRounded}
              key={userID}
              color={localStorage.getItem("name") === userID ? "blue" : undefined}
            >
              {userID}
            </SidebarButton>
          ))}
        </VStack>
      </VStack>
      <Modal isOpen={isInviteModalOpen} onClose={closeInviteModal} isCentered={isModalCentered}>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader color={{ dark: "lightBlue.300", light: "lightBlue.700" }[colorMode]}>
            invite some friends
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="inviteCode">
                <FormLabel>Invite link</FormLabel>
                <Input type="text" readOnly value={location.origin + "/join/" + sessionID} />
                <FormHelperText>Send your friends this link to join the sesh...</FormHelperText>
              </FormControl>
              <FormControl id="inviteCode">
                <FormLabel>Invite code</FormLabel>
                <Input type="text" readOnly value={sessionID} />
                <FormHelperText>...or have them type this code into the join page</FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={"warmGray"} onClick={closeInviteModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isEndModalOpen}
        leastDestructiveRef={cancelEndBtnRef as any}
        onClose={closeEndModal}
        isCentered={isModalCentered}
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx={4}>
          <AlertDialogHeader color={{ dark: "red.300", light: "red.700" }[colorMode]}>end sesh</AlertDialogHeader>
          <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelEndBtnRef as any} onClick={closeEndModal}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={endSession} ml={3}>
              End sesh
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
