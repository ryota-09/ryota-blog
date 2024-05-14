import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type {
  BaseMicroCMSApiType,
  BlogsContentType,
  CategoriesContentType,
  EndPointLiteralType,
  GetObjectType,
  MappedKeyLiteralType,
} from "@/types/microcms";
import { microCMSAPIKey, microCMSServiceDomain } from "@/config";
import { CATEGORY_MAPED_ID, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, PER_PAGE } from "@/static/blogs";

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

export const getBlogByKeyword = (keyword: string, querys?: MicroCMSQueries) => {
  return MicroCMSApiGetListHandler<BlogsContentType>("blogs", {
    q: keyword,
    ...querys,
  });
}

export const getCategoryList = (querys?: MicroCMSQueries) =>
  MicroCMSApiGetListHandler<CategoriesContentType>("categories", querys);

export const generateQuery = (searchParams: { [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType, [KEYWORD_QUERY]: string }) => {
  let filters = "";
  const query: MicroCMSQueries = { limit: PER_PAGE, offset: 0 }

  if (searchParams[PAGE_QUERY]) {
    query.offset = (parseInt(searchParams[PAGE_QUERY]) - 1) * PER_PAGE;
  }

  // filters
  if (searchParams[CATEGORY_QUERY]) {
    filters += `${CATEGORY_QUERY}[contains]${CATEGORY_MAPED_ID[searchParams[CATEGORY_QUERY]]}`;
  }

  if (searchParams[KEYWORD_QUERY]) {
    query.q = searchParams[KEYWORD_QUERY];
  }

  return { ...query, filters };
}