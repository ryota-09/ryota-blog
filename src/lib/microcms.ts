import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type {
  BaseMicroCMSApiType,
  EndPointLiteralType,
  GetObjectType,
  SateiPageContentType,
} from "@/types/microcms";
import { microCMSAPIKey, microCMSServiceDomain } from "@/config";

if (!microCMSServiceDomain) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!microCMSAPIKey) {
  throw new Error("MICROCMS_API_KEY is required");
}

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: microCMSServiceDomain,
  apiKey: microCMSAPIKey,
});

const baseMicroCMSApiGetHandler: BaseMicroCMSApiType =
  (objectType: GetObjectType) =>
    <T>(
      endpoint: EndPointLiteralType,
      queries?: MicroCMSQueries,
      contentId?: string
    ) => {
      switch (objectType) {
        case "LIST":
          return client.get<T>({ endpoint, queries });
        case "SINGLE":
          return client.get<T>({ endpoint, contentId, queries });
        default:
          throw new Error(`🔥: objectTypeに誤りがあります。 ${objectType}`);
      }
    };

const MicroCMSApiGetListHandler = baseMicroCMSApiGetHandler("LIST");

const MicroCMSApiGetSingleObjectHandler = baseMicroCMSApiGetHandler("SINGLE");

export const getArticleList = (querys?: MicroCMSQueries) =>
  MicroCMSApiGetListHandler<SateiPageContentType>("blogs", querys);

export const getArticleById = (contentId: string, querys?: MicroCMSQueries) =>
  MicroCMSApiGetSingleObjectHandler<SateiPageContentType>(
    "blogs",
    querys,
    contentId
  );

type MicroCMSResponse = {
  [key: string]: any; // 適切なプロパティと型をここに定義する
};

// 型Tとそれの部分型を引数にとる非同期関数を定義（アロー関数版）
// export const fn = async <T>(
//   ...args: (keyof T)[]
// ): Promise<Pick<T, (typeof args)[number]>> => {
//   const optionValue = args.join(",");
//   const data = await client.get<Pick<T, (typeof args)[number]>>({
//     endpoint: "tables",
//     queries: { fields: optionValue },
//   });
//   console.log(data);
//   return data; // 型アサーションを使用して戻り値の型を明示的に指定
// };

// export const fn = async <T>(
//   ...args: (keyof T)[]
// ) => {
//   const optionValue = args.join(",");
//   const data = await client.get<Pick<T, (typeof args)[number]>>({
//     endpoint: "tables",
//     queries: { fields: optionValue },
//   });
//   console.log(data);
//   return data;
// };

export const fn = async <T, K extends keyof T>(
  ...args: K[]
): Promise<Pick<T, K>> => {
  const optionValue = args.join(",");
  const data = await client.get<Pick<T, K>>({
    endpoint: "tables",
    queries: { fields: optionValue },
  });
  console.log(data);
  return data;
};