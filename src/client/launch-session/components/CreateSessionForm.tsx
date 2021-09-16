import React from "react";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAsyncFn, useMethods } from "react-use";

import { APIService } from "~/client/ctrl/api";

const fieldState = {
  value: "",
  error: null as string | null,
  hasErrored: true,
};

const initialFormState = {
  sessionName: fieldState,
  userID: fieldState,
};

type CreateSessionFormState = typeof initialFormState;

const validateFieldValue = (value: string) => ({
  error: !value || value == "" || !/\S/.test(value),
});

function _createFormStateMethods(state: CreateSessionFormState) {
  return {
    setSessionName(value: string) {
      const error = validateFieldValue(value).error && "Sesh Name is invalid";
      return {
        ...state,
        sessionName: { value, error: state.sessionName.hasErrored && error ? error : null },
      } as CreateSessionFormState;
    },
    setSessionNameError(error: string) {
      return {
        ...state,
        sessionName: { ...state.sessionName, error, hasErrored: !!error || state.sessionName.hasErrored },
      } as CreateSessionFormState;
    },
    setUserID(value: string) {
      const error = validateFieldValue(value).error && "User ID is invalid";
      return {
        ...state,
        userID: { value, error: state.userID.hasErrored && error ? error : null },
      } as CreateSessionFormState;
    },
    setUserIDError(error: string) {
      return {
        ...state,
        userID: { ...state.userID, error, hasErrored: !!error || state.userID.hasErrored },
      } as CreateSessionFormState;
    },
  };
}

export const CreateSessionForm: React.FC = () => {
  const router = useRouter();

  const { colorMode } = useColorMode();
  const toast = useToast({ position: "bottom-right" });

  const [formState, formMethods] = useMethods(_createFormStateMethods, initialFormState);

  function _validateInputs() {
    const sessionNameValidation = validateFieldValue(formState.sessionName.value);
    formMethods.setSessionNameError(sessionNameValidation.error);
    if (sessionNameValidation.error) {
      toast({
        title: "Session Name is invalid",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    const userIDValidation = validateFieldValue(formState.userID.value);
    formMethods.setUserIDError(userIDValidation.error);
    if (userIDValidation.error) {
      toast({
        title: "User ID is invalid",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    return sessionNameValidation.error || userIDValidation.error;
  }

  const [submitState, onSubmit] = useAsyncFn(async () => {
    // if inputs are invalid, terminate submission
    if (_validateInputs()) return;

    try {
      const sessionID = await APIService.createSession({
        name: formState.sessionName.value,
        adminID: formState.userID.value,
        userIDs: [],
        chats: [],
      });
      localStorage.setItem("name", formState.userID.value);
      await router.push("/session/" + sessionID);
      toast({
        title: "Created sesh!",
        status: "success",
        variant: "solid",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "An error occurred",
        description: (e as Error).message,
        status: "error",
        variant: "solid",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [formState]);

  return (
    <VStack
      spacing={4}
      mb={6}
      p={6}
      maxW={"md"}
      w={"full"}
      bg={{ dark: "warmGray.900", light: "white" }[colorMode]}
      borderRadius={"md"}
      shadow={"sm"}
      textAlign={"left"}
    >
      <FormControl id="sessionName">
        <FormLabel>Sesh Name</FormLabel>
        <Input
          type="text"
          placeholder={"Name of the sesh"}
          value={formState.sessionName.value}
          onChange={e => formMethods.setSessionName(e.target.value)}
          isInvalid={!!formState.sessionName.error}
        />
        <FormHelperText>This name will be displayed to users to identify the sesh.</FormHelperText>
      </FormControl>
      <FormControl id="userID" colorScheme={"red"}>
        <FormLabel>User ID</FormLabel>
        <Input
          type="text"
          placeholder={"Your user name/ID"}
          value={formState.userID.value}
          onChange={e => formMethods.setUserID(e.target.value)}
          isInvalid={!!formState.userID.error}
        />
        <FormHelperText>This will be used to identify you in the sesh page.</FormHelperText>
      </FormControl>
      <Box w={"full"}>
        <Divider my={2} />
      </Box>
      <Button colorScheme={"indigo"} w={"full"} fontSize={"xl"} onClick={onSubmit} isLoading={submitState.loading}>
        Launch session!
      </Button>
    </VStack>
  );
};
