import React from "react";

import { VStack } from "@chakra-ui/react";
import Head from "next/head";

import { CenterPageWrapper } from "~/client/core/components/CenterPageWrapper";
import { PageTransition } from "~/client/core/components/PageTransition";
import { CreateSessionForm } from "~/client/launch-session/components/CreateSessionForm";
import { SessionFormHeader } from "~/client/launch-session/components/SessionFormHeader";
import { SessionFormLogo } from "~/client/launch-session/components/SessionFormLogo";

export default function CreateSessionPage() {
  return (
    <PageTransition variant={"upAndDown"}>
      <Head>
        <title>Start a new sesh | SuperSesh!</title>
      </Head>
      <CenterPageWrapper>
        <VStack spacing={6} maxW={"lg"} w={"full"} display={"flex"} alignItems={"center"} flexDir={"column"}>
          <SessionFormLogo />
          <SessionFormHeader
            title={"Start a new sesh"}
            redirect={{ hint: "Already have a sesh to join?", title: "Join a sesh", href: "/join" }}
          />
          <CreateSessionForm />
        </VStack>
      </CenterPageWrapper>
    </PageTransition>
  );
}
