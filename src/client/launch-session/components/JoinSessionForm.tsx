import React, { useEffect } from "react";

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

import APIService from "~/client/core/services/api";
import APIErrors from "~/shared/types/APIErrors";

const fieldState = {
  value: "",
  error: null as string | null,
  hasErrored: true,
};

const initialFormState = {
  sessionID: fieldState,
  userID: fieldState,
};

type CreateSessionFormState = typeof initialFormState;

const validateFieldValue = (value: string) => ({
  error: !value || value == "" || !/\S/.test(value),
});

function _createFormStateMethods(state: CreateSessionFormState) {
  return {
    setSessionID(value: string) {
      const error = validateFieldValue(value).error && "Sesh ID is invalid";
      return {
        ...state,
        sessionID: { ...state.sessionID, value, error: state.sessionID.hasErrored && error ? error : null },
      } as CreateSessionFormState;
    },
    setSessionIDError(error: string) {
      return {
        ...state,
        sessionID: { ...state.sessionID, error, hasErrored: !!error || state.sessionID.hasErrored },
      } as CreateSessionFormState;
    },
    setUserID(value: string) {
      const error = validateFieldValue(value).error && "User ID is invalid";
      return {
        ...state,
        userID: { ...state.userID, value, error: state.userID.hasErrored && error ? error : null },
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

export const JoinSessionForm = () => {
  const router = useRouter();

  const { colorMode } = useColorMode();
  const toast = useToast({ position: "bottom-right" });

  const [formState, formMethods] = useMethods(_createFormStateMethods, initialFormState);

  // if a join link is opened, the sessionID will be stored in the router.query object
  // set sessionID value in the form state to this value
  useEffect(() => {
    router.query.sessionID && formMethods.setSessionID(router.query.sessionID);
  }, [router.query.sessionID]);

  // set userID value to "name" item in localStorage if it is present
  useEffect(() => {
    localStorage.getItem("name") && formMethods.setUserID(localStorage.getItem("name"));
  }, []);

  function _validateInputs() {
    const sessionIDValidation = validateFieldValue(formState.sessionID.value);
    formMethods.setSessionIDError(sessionIDValidation.error);
    if (sessionIDValidation.error) {
      toast({
        title: "Sesh ID is invalid",
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

    return sessionIDValidation.error || userIDValidation.error;
  }

  const [submitState, onSubmit] = useAsyncFn(async () => {
    // if inputs are invalid, terminate submission
    if (_validateInputs()) return;

    try {
      await APIService.I.joinSession(formState.sessionID.value, formState.userID.value);
      localStorage.setItem("name", formState.userID.value);
      await router.push("/session/" + formState.sessionID.value);
      toast({
        title: "Joined sesh!",
        status: "success",
        variant: "solid",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      switch ((e as Error).message as APIErrors) {
        case APIErrors.USER_ID_TAKEN:
          toast({
            title: "User ID is already taken",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        case APIErrors.SESSION_NOT_FOUND:
          toast({
            title: "Sesh ID not found",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
      }
    }
  }, [formState.sessionID.value, formState.userID.value]);

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
      <FormControl id="seshName">
        <FormLabel>Sesh ID</FormLabel>
        <Input
          type="text"
          placeholder={"ID of the sesh"}
          value={formState.sessionID.value}
          onChange={e => formMethods.setSessionID(e.target.value)}
          isInvalid={!!formState.sessionID.error}
        />
        <FormHelperText>This is the unique ID used to join the sesh.</FormHelperText>
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
        Launch sesh!
      </Button>
    </VStack>
  );
};
