import { mockedArticles } from "@/__tests__/mocks/data";
import {  HttpResponse, HttpResponseResolver, PathParams } from "msw"

export const mockedGetBlogList = () => {
  return HttpResponse.json(mockedArticles)
}