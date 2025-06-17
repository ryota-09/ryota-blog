import { createClient } from "microcms-js-sdk";
import type { CustomRequestInit, MicroCMSQueries } from "microcms-js-sdk";
import { mockedArticles } from "@/__tests__/mocks/data";
import type {
  BaseMicroCMSApiListDataType,
  BaseMicroCMSApiType,
  BlogsContentType,
  CategoriesContentType,
  EndPointLiteralType,
  GetObjectType,
} from "@/types/microcms";
import { microCMSAPIKey, microCMSServiceDomain } from "@/config";

const skipMicroCMS = process.env.SKIP_MICROCMS === "true";

if (!microCMSServiceDomain && !skipMicroCMS) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!microCMSAPIKey && !skipMicroCMS) {
  throw new Error("MICROCMS_API_KEY is required");
}

// API取得用のクライアントを作成
export const client = skipMicroCMS
  ? ({
      get: async () => mockedArticles,
      getAllContents: async () => mockedArticles.contents,
      getAllContentIds: async () =>
        mockedArticles.contents.map((item) => ({ id: item.id })),
    } as any)
  : createClient({
      serviceDomain: microCMSServiceDomain,
      apiKey: microCMSAPIKey,
    });

const baseMicroCMSApiGetHandler: BaseMicroCMSApiType =
  (objectType: GetObjectType) =>
    async <T>(
      endpoint: EndPointLiteralType,
      queries?: MicroCMSQueries,
      customRequestInit?: CustomRequestInit,
      contentId?: string,
    ) => {
      if (skipMicroCMS) {
        if (objectType === "LIST") {
          return mockedArticles as any;
        }
        return Promise.resolve({} as T);
      }

      switch (objectType) {
        case "LIST":
          return (client as any).get({ endpoint, queries, customRequestInit }) as Promise<T>;
        case "SINGLE":
          return (client as any).get({ endpoint, queries, contentId, customRequestInit }) as Promise<T>;
        default:
          throw new Error(`🔥: objectTypeに誤りがあります。 ${objectType}`);
      }
    };

const MicroCMSApiGetListHandler = baseMicroCMSApiGetHandler("LIST");

const MicroCMSApiGetSingleObjectHandler = baseMicroCMSApiGetHandler("SINGLE");

export const getBlogList = (querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) =>
  MicroCMSApiGetListHandler<BlogsContentType>("blogs", querys, customRequestInit);

export const getAllBlogList = async (querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  const data = (client as any).getAllContents({ endpoint: "blogs", ...querys, ...customRequestInit }) as Promise<BlogsContentType[]>;
  return data;
}


export const getAllCategoryList = async (querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  const data = await (client as any).getAllContents({ endpoint: "categories", ...querys, ...customRequestInit }) as Promise<CategoriesContentType[]>;
  return data;
}

export const getCategoryById = (contentId: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) =>
  MicroCMSApiGetSingleObjectHandler<CategoriesContentType>(
    "categories",
    querys,
    customRequestInit,
    contentId,
  );


// English blog functions
export const getBlogListEn = (querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) =>
  MicroCMSApiGetListHandler<BlogsContentType>("blogs_en", querys, customRequestInit);

export const getAllBlogListEn = async (querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  const data = (client as any).getAllContents({ endpoint: "blogs_en", ...querys, ...customRequestInit }) as Promise<BlogsContentType[]>;
  return data;
}

export const getBlogByIdEn = (contentId: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) =>
  MicroCMSApiGetSingleObjectHandler<BlogsContentType>(
    "blogs_en",
    querys,
    customRequestInit,
    contentId,
  );

export const getAllBlogIdsEn = async (alternatedField?: string) => {
  const data = await (client as any).getAllContentIds({ endpoint: "blogs_en", alternateField: alternatedField });
  return data;
}

export const getBlogByKeywordEn = (keyword: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  return MicroCMSApiGetListHandler<BlogsContentType>("blogs_en", {
    q: keyword,
    ...querys,
    ...customRequestInit,
  });
}

// Locale-aware wrapper functions
export const getBlogListByLocale = (locale: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  return locale === 'en' ? getBlogListEn(querys, customRequestInit) : getBlogList(querys, customRequestInit);
}

export const getAllBlogListByLocale = async (locale: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  return locale === 'en' ? getAllBlogListEn(querys, customRequestInit) : getAllBlogList(querys, customRequestInit);
}

export const getBlogByIdByLocale = (locale: string, contentId: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  return locale === 'en' 
    ? getBlogByIdEn(contentId, querys, customRequestInit) 
    : MicroCMSApiGetSingleObjectHandler<BlogsContentType>("blogs", querys, customRequestInit, contentId);
}

export const getAllBlogIdsByLocale = async (locale: string, alternatedField?: string) => {
  if (locale === 'en') {
    return getAllBlogIdsEn(alternatedField);
  } else {
    return await (client as any).getAllContentIds({ endpoint: "blogs", alternateField: alternatedField });
  }
}

export const getBlogByKeywordByLocale = (locale: string, keyword: string, querys?: MicroCMSQueries, customRequestInit?: CustomRequestInit) => {
  const endpoint = locale === 'en' ? 'blogs_en' : 'blogs';
  return MicroCMSApiGetListHandler<BlogsContentType>(endpoint as EndPointLiteralType, {
    q: keyword,
    ...querys,
    ...customRequestInit,
  });
}

export const getPopularBlogsByCategoryByLocale = async (
  locale: string,
  categoryName: string,
  limit: number = 3,
  customRequestInit?: CustomRequestInit
) => {
  const endpoint = locale === 'en' ? 'blogs_en' : 'blogs';
  const data = await (client as any).get({
    endpoint: endpoint as EndPointLiteralType,
    queries: {
      fields: "id,title,publishedAt,updatedAt,category,pageViews,thumbnail,description",
      filters: `category[contains]${categoryName}`,
      limit,
      orders: "-pageViews,-publishedAt",
    },
    customRequestInit: customRequestInit || {
      next: {
        // NOTE: １日保持 60 * 60 * 24
        revalidate: 86400
      }
    }
  });

  return data.contents;
};

export const getPrevAndNextBlogByLocale = async (locale: string, data: BlogsContentType) => {
  const publishedAt = data.publishedAt;
  const endpoint = locale === 'en' ? 'blogs_en' : 'blogs';
  
  const [prev, next] = await Promise.all([
    (client as any).get({
      endpoint: endpoint as EndPointLiteralType,
      queries: {
        fields: "id,title,publishedAt,updatedAt,category",
        filters: `publishedAt[less_than]${publishedAt}`,
        limit: 1,
        orders: "-publishedAt",
      },
      customRequestInit: {
        next: {
          // NOTE: １日保持 60 * 60 * 24
          revalidate: 86400
        }
      }
    }),
    (client as any).get({
      endpoint: endpoint as EndPointLiteralType,
      queries: {
        fields: "id,title,publishedAt,updatedAt,category",
        filters: `publishedAt[greater_than]${publishedAt}`,
        limit: 1,
        orders: "publishedAt",
      },
      customRequestInit: {
        next: {
          // NOTE: １日保持 60 * 60 * 24
          revalidate: 86400
        }
      }
    })
  ])

  const prevBlogData = prev.contents[0] || null
  const nextBlogData = next.contents[0] || null

  return { prevBlogData, nextBlogData }
}