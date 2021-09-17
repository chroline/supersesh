import { useEffect } from "react";

import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAsync } from "react-use";

import { APIService } from "~/client/ctrl/api";
import { SessionDataService } from "~/client/ctrl/session-data";
import SessionPageProps from "~/client/session-page/util/SessionPageProps";
import APIErrors from "~/shared/types/APIErrors";

export const handleSessionPageRedirects = (props: SessionPageProps, isJoined: boolean, sessionID: string) => {
  const router = useRouter(),
    toast = useToast({ position: "bottom-right" });

  // verify user has joined session
  // otherwise redirect to join page
  useEffect(() => {
    if (!isJoined) {
      toast({
        title: "You must join this session before entering",
        status: "error",
        variant: "solid",
        duration: 9000,
        isClosable: true,
      });
      router.push("/join/" + sessionID);
    }
  }, [isJoined]);

  // verify no users in server-side props generation
  // otherwise redirect to homepage
  useEffect(() => {
    if (props.error) {
      switch (props.error as APIErrors) {
        case APIErrors.SESSION_NOT_FOUND:
          toast({
            title: "Sesh could not be found",
            status: "error",
            variant: "solid",
            duration: 9000,
            isClosable: true,
          });
          break;
        default:
          toast({
            title: "An error occurred",
            description: props.error,
            status: "error",
            variant: "solid",
            duration: 9000,
            isClosable: true,
          });
          break;
      }
      router.push("/");
    }
  }, [props.error]);

  // get session data and verify no errors occur
  // otherwise redirect to homepage
  useAsync(async () => {
    if (sessionID && !props.error) {
      try {
        SessionDataService.setSessionData(await APIService.getSessionData(sessionID));
      } catch (e) {
        toast({
          title: "An error occurred",
          description: (e as Error).message,
          status: "error",
          variant: "solid",
          duration: 9000,
          isClosable: true,
        });
        router.push("/");
      }
    }
  }, [sessionID]);
};
