import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type {
  BaseMicroCMSApiType,
  BlogsContentType,
  CategoriesContentType,
  EndPointLiteralType,
  GetObjectType,
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

export const getBlogList = (querys?: MicroCMSQueries) =>
  MicroCMSApiGetListHandler<BlogsContentType>("blogs", querys);

export const getBlogById = (contentId: string, querys?: MicroCMSQueries) =>
  MicroCMSApiGetSingleObjectHandler<BlogsContentType>(
    "blogs",
    querys,
    contentId
  );

export const getCategoryList = (querys?: MicroCMSQueries) =>
  MicroCMSApiGetListHandler<CategoriesContentType>("categories", querys);