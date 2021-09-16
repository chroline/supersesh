import { useEffect } from "react";

import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { APIService } from "~/client/ctrl/api";
import { SessionDataService } from "~/client/ctrl/session-data";
import SessionPageProps from "~/client/session-page/util/SessionPageProps";
import APIErrors from "~/shared/types/APIErrors";

export const useHandleSessionPageRedirects = (props: SessionPageProps, isJoined: boolean, sessionID: string) => {
  const router = useRouter(),
    toast = useToast({ position: "bottom-right" });

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
          router.push("/");
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
          router.push("/");
          break;
      }
    } else if (!isJoined) {
      toast({
        title: "You must join this session before entering",
        status: "error",
        variant: "solid",
        duration: 9000,
        isClosable: true,
      });
      router.push("/join/" + sessionID);
    }
  }, [props.error]);

  useEffect(() => {
    sessionID &&
      !props.error &&
      APIService.getSessionData(sessionID)
        .then(SessionDataService.setSessionData)
        .catch(e => {
          toast({
            title: "An error occurred",
            description: (e as Error).message,
            status: "error",
            variant: "solid",
            duration: 9000,
            isClosable: true,
          });
          router.push("/");
        });
  }, [sessionID]);
};
