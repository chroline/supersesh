import React from "react";

import { VStack } from "@chakra-ui/react";
import Head from "next/head";

import { CenterPageWrapper } from "~/client/core/components/CenterPageWrapper";
import { PageTransition } from "~/client/core/components/PageTransition";
import { JoinSessionForm } from "~/client/launch-session/components/JoinSessionForm";
import { SessionFormHeader } from "~/client/launch-session/components/SessionFormHeader";
import { SessionFormLogo } from "~/client/launch-session/components/SessionFormLogo";

export const JoinSessionPage = () => (
  <PageTransition variant={"upAndDown"}>
    <Head>
      <title>Join a sesh | SuperSesh!</title>
    </Head>
    <CenterPageWrapper>
      <VStack spacing={6} maxW={"lg"} w={"full"} display={"flex"} alignItems={"center"} flexDir={"column"}>
        <SessionFormLogo />
        <SessionFormHeader
          title={"Join a  sesh"}
          redirect={{ hint: "Want to start a sesh instead?", title: "Start a new sesh", href: "/session" }}
        />
        <JoinSessionForm />
      </VStack>
    </CenterPageWrapper>
  </PageTransition>
);
