import { CATEGORY_MAPED_ID } from "@/static/blogs";
import type {
  MicroCMSDate,
  MicroCMSImage,
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSContentId,
  CustomRequestInit,
} from "microcms-js-sdk";

const ENDPOINT_LIST = ["blogs", "categories"] as const;

const CUSTOM_FIELD = {
  richEditor: "richEditor",
  html: "html"
} as const;

type CustomFieldLiteralType = keyof typeof CUSTOM_FIELD;

export type EndPointLiteralType = (typeof ENDPOINT_LIST)[number];

type MicroCMSFields = Readonly<{
  text: string;
  number: number;
  richEditor: string;
  boolean: boolean;
  image: MicroCMSImage;
  date: MicroCMSDate;
}>;

export type BaseMicroCMSApiSingleDataType<T extends MicroCMSContentId> = {
  id: string;
  createdAt: string;
  updatedAt: string;
} & T;

export type BaseMicroCMSApiListDataType<T extends MicroCMSListContent> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

type MicroCMSCustomFieldType<T extends CustomFieldLiteralType, U> = {
  fieldId: T;
} & U;

type BodyRichEditorType = MicroCMSCustomFieldType<
  typeof CUSTOM_FIELD.richEditor,
  {
    richEditor: MicroCMSFields["richEditor"];
  }
>;

type BodyHTMLType = MicroCMSCustomFieldType<
  typeof CUSTOM_FIELD.html,
  {
    html: MicroCMSFields["text"];
  }
>;

export type RepeatedFieldListType<
  T extends MicroCMSCustomFieldType<CustomFieldLiteralType, object>
> = T[];

type APIContentType<T> = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  revisedAt?: string;
} & T;

export type CategoriesContentType = APIContentType<{
  name: MicroCMSFields["text"];
}>

export type BlogsContentType = APIContentType<{
  title: MicroCMSFields["text"];
  body: RepeatedFieldListType<BodyRichEditorType | BodyHTMLType>;
  description: MicroCMSFields["text"];
  noIndex: MicroCMSFields["boolean"];
  isAdvertisement: MicroCMSFields["boolean"];
  thumbnail?: MicroCMSFields["image"];
  category: CategoriesContentType[];
  relatedContent: BlogsContentType[];
}>

export type GetObjectType = "LIST" | "SINGLE";

export type BaseMicroCMSApiType = {
  (getObjectType: "LIST"): <T extends MicroCMSListContent>(
    endpoint: EndPointLiteralType,
    queries?: MicroCMSQueries,
    customRequestInit?: CustomRequestInit,
  ) => Promise<BaseMicroCMSApiListDataType<T>>;
  (getObjectType: "SINGLE"): <T extends MicroCMSContentId>(
    endpoint: EndPointLiteralType,
    queries: MicroCMSQueries | undefined,
    customRequestInit: CustomRequestInit | undefined,
    contentId: string,
  ) => Promise<BaseMicroCMSApiSingleDataType<T>>;
};

export type _PreviewData = {
  draftKey: string;
  directory: string;
};

export type TableOfContentsType = {
  id: string;
  label: string;
  domName: "h2" | "h3";
};

export type MappedKeyLiteralType = keyof typeof CATEGORY_MAPED_ID;

// カテゴリAPIのレスポンス型
export type CategoriesApiResponseType = BaseMicroCMSApiListDataType<CategoriesContentType>;
