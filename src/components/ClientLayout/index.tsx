"use client"
import { useEffect, type ReactNode } from "react";
import type { AwsRumConfig } from "aws-rum-web";

import { applicationId, gustRoleArn, identityPoolId } from "@/config";

const APPLICATION_VERSION = "1.0.0";
const APPLICATION_REGION = "ap-northeast-1";
const RUM_ENDPOINT = "https://dataplane.rum.ap-northeast-1.amazonaws.com";

const config: AwsRumConfig = {
  sessionSampleRate: 1,
  guestRoleArn: gustRoleArn,
  identityPoolId: identityPoolId,
  endpoint: RUM_ENDPOINT,
  telemetries: ["performance", "errors", "http"],
  allowCookies: true,
  enableXRay: false,
}

const RUM_STORAGE_KEY = 'aws_rum_initialized';

type ClientLayoutProps = {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  useEffect(() => {
    const isInitialized = localStorage.getItem(RUM_STORAGE_KEY);
    if (isInitialized === 'true') {
      return;
    }

    const initRUM = async () => {
      try {
        const { AwsRum } = await import('aws-rum-web');
        new AwsRum(
          applicationId,
          APPLICATION_VERSION,
          APPLICATION_REGION,
          config
        );
        localStorage.setItem(RUM_STORAGE_KEY, 'true');
      } catch (error) {
        console.error("Error initializing CloudWatch RUM.", error);
      }
    };

    if (navigator.userAgent.toLocaleLowerCase().includes("safari") || 
        navigator.userAgent.toLocaleLowerCase().includes("instagram")) {
      setTimeout(initRUM, 2000);
      return;
    }

    requestIdleCallback(initRUM);
  }, []);
  
  return children;
}
export default ClientLayout;
