"use client"
import { useEffect, type ReactNode } from "react";
import { AwsRum, type AwsRumConfig } from "aws-rum-web";

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

type ClientLayoutProps = {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  useEffect(() => {
    // NOTE:safariとInstagram内ブラウザの場合はRequestIdleCallbackが使えないため、初期化処理を遅延させない
    if (navigator.userAgent.toLocaleLowerCase().includes("safari") || navigator.userAgent.toLocaleLowerCase().includes("instagram")) {
      try {
        new AwsRum(
          applicationId,
          APPLICATION_VERSION,
          APPLICATION_REGION,
          config
        )
      } catch (error) {
        console.error("Error initializing CloudWatch RUM.", error)
      }
      return
    }

    // RequestIdleCallbackを使って初期化処理を遅延させる
    requestIdleCallback(() => {
      try {
        new AwsRum(
          applicationId,
          APPLICATION_VERSION,
          APPLICATION_REGION,
          config
        )
      } catch (error) {
        console.error("Error initializing CloudWatch RUM.", error)
      }
    })
  }, [])
  return children
}
export default ClientLayout;