import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type {
  BaseMicroCMSApiListDataType,
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
          return client.get<T>({
            endpoint, queries
          });
        case "SINGLE":
          return client.get<T>({
            endpoint, contentId, queries
          });
        default:
          throw new Error(`🔥: objectTypeに誤りがあります。 ${objectType}`);
      }
    };

const MicroCMSApiGetListHandler = baseMicroCMSApiGetHandler("LIST");

const MicroCMSApiGetSingleObjectHandler = baseMicroCMSApiGetHandler("SINGLE");

export const getBlogList = (querys?: MicroCMSQueries) =>
  MicroCMSApiGetListHandler<BlogsContentType>("blogs", { ...querys });

export const getAllBlogList = async (querys?: MicroCMSQueries) => {
  const data = client.getAllContents<BlogsContentType>({ "endpoint": "blogs", ...querys });
  return data;
}

export const getBlogById = (contentId: string, querys?: MicroCMSQueries) =>
  MicroCMSApiGetSingleObjectHandler<BlogsContentType>(
    "blogs",
    querys,
    contentId
  );

export const getAllBlogIds = async (alternatedField?: string) => {
  const data = await client.getAllContentIds({ endpoint: "blogs", alternateField: alternatedField });
  return data;
}

export const getBlogByKeyword = (keyword: string, querys?: MicroCMSQueries) => {
  return MicroCMSApiGetListHandler<BlogsContentType>("blogs", {
    q: keyword,
    ...querys,
  });
}

export const getAllCategoryList = async (querys?: MicroCMSQueries) => {
  const data = await client.getAllContents<CategoriesContentType>({ "endpoint": "categories", ...querys });
  return data;
}

export const getPrevAndNextBlog = async (data: BlogsContentType) => {
  const publishedAt = data.publishedAt;
  const [ prev, next ] = await Promise.all([
    client.get<BaseMicroCMSApiListDataType<BlogsContentType>>({
      endpoint: "blogs",
      queries: {
        fields: "id,title,publishedAt,updatedAt",
        filters: `publishedAt[less_than]${publishedAt}`,
        limit: 1,
        orders: "-publishedAt",
      }
    }),
    client.get<BaseMicroCMSApiListDataType<BlogsContentType>>({
      endpoint: "blogs",
      queries: {
        fields: "id,title,publishedAt,updatedAt",
        filters: `publishedAt[greater_than]${publishedAt}`,
        limit: 1,
        orders: "publishedAt",
      }
    })
  ])

  const prevBlogData = prev.contents[0] || null
  const nextBlogData = next.contents[0] || null

  return { prevBlogData, nextBlogData }
}