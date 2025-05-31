
import { mockedArticles } from "@/__tests__/mocks/data";
import { HttpResponse, http } from "msw";

const microCMSBaseURL = `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1`;

export const handlers = [
  http.get(`${microCMSBaseURL}/blogs`, ({ request }) => {
    return HttpResponse.json(mockedArticles)
  })
]