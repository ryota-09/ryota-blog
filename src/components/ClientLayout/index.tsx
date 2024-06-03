"use client"
import { useEffect, type ReactNode } from "react";
import { AwsRum, type AwsRumConfig } from "aws-rum-web";

import { applicationId, gustRoleArn, identityPoolId } from "@/config";

const APPLICATION_VERSION = "1.0.0";
const APPLICATION_REGION = "ap-northeast-1";
const RUM_ENDPOINT = "https://dataplane.rum.ap-northeast-1.amazonaws.com";

type ClientLayoutProps = {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  useEffect(() => {
    try {
      const config: AwsRumConfig = {
        sessionSampleRate: 1,
        guestRoleArn: gustRoleArn,
        identityPoolId: identityPoolId,
        endpoint: RUM_ENDPOINT,
        telemetries: ["performance", "errors", "http"],
        allowCookies: true,
        enableXRay: false,
      }
      
      new AwsRum(
        applicationId,
        APPLICATION_VERSION,
        APPLICATION_REGION,
        config
      )
    } catch (error) {
      console.error("Error initializing CloudWatch RUM.", error)
    }
  }, [])
  return children
}
export default ClientLayout;