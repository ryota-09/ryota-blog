import type { BaseMicroCMSApiListDataType, BlogsContentType } from "@/types/microcms";

export const mockedArticles: BaseMicroCMSApiListDataType<BlogsContentType> = {
  "contents": [
    {
      "id": "example1",
      "createdAt": "2024-05-31T03:43:40.088Z",
      "updatedAt": "2024-05-31T04:13:26.975Z",
      "publishedAt": "2022-05-22T00:00:00.000Z",
      "revisedAt": "2024-05-31T04:13:26.975Z",
      "title": "example title 1",
      "body": [
        {
          "fieldId": "richEditor",
          "richEditor": "<h2 id=\"example\">example heading</h2><p>example paragraph.</p>"
        },
        {
          "fieldId": "html",
          "html": "<a href=\"https://example.com\" rel=\"nofollow\">example link</a>"
        },
        {
          "fieldId": "richEditor",
          "richEditor": "<h2 id=\"example\">example heading 2</h2><p>another example paragraph.</p><figure><img src=\"https://example.com/image.jpg\" alt=\"example\" width=\"1024\" height=\"572\"></figure><p>more example text.</p>"
        }
      ],
      "description": "example description 1",
      "noIndex": false,
      "isAdvertisement": true,
      "category": [
        {
          "id": "exampleCategory1",
          "createdAt": "2024-05-30T02:02:36.424Z",
          "updatedAt": "2024-06-02T04:09:25.34Z",
          "publishedAt": "2024-05-30T02:02:36.424Z",
          "revisedAt": "2024-05-30T02:02:36.424Z",
          "name": "example category 1"
        }
      ],
      "relatedContent": []
    },
    {
      "id": "example2",
      "createdAt": "2024-05-30T12:58:22.052Z",
      "updatedAt": "2024-06-04T08:33:34.665Z",
      "publishedAt": "2022-09-11T00:00:00.000Z",
      "revisedAt": "2024-06-04T08:33:34.665Z",
      "title": "example title 2",
      "body": [
        {
          "fieldId": "richEditor",
          "richEditor": "<p>Hello! This is a test article.</p><p>More test content here.</p><h2 id=\"test\">Test Heading</h2><p>Test paragraph.</p>"
        },
        {
          "fieldId": "html",
          "html": "<a href=\"https://test.com\" rel=\"nofollow\">test link</a>"
        }
      ],
      "description": "test description 2",
      "noIndex": false,
      "isAdvertisement": true,
      "thumbnail": {
        "url": "https://example.com/thumbnail.jpg",
        "height": 1080,
        "width": 1920
      },
      "category": [
        {
          "id": "exampleCategory2",
          "createdAt": "2024-05-30T02:02:36.424Z",
          "updatedAt": "2024-06-02T04:09:25.34Z",
          "publishedAt": "2024-05-30T02:02:36.424Z",
          "revisedAt": "2024-05-30T02:02:36.424Z",
          "name": "example category 2"
        },
        {
          "id": "testCategory",
          "createdAt": "2024-05-01T12:08:35.315Z",
          "updatedAt": "2024-05-25T07:13:23.178Z",
          "publishedAt": "2024-05-01T12:08:35.315Z",
          "revisedAt": "2024-05-25T05:30:36.705Z",
          "name": "test category"
        }
      ],
      "relatedContent": [
        {
          "id": "relatedExample1",
          "createdAt": "2024-05-30T10:38:16.278Z",
          "updatedAt": "2024-06-04T09:10:16.453Z",
          "publishedAt": "2022-10-09T15:00:00.000Z",
          "revisedAt": "2024-06-04T09:10:16.453Z",
          "title": "related example title",
          "body": [
            {
              "fieldId": "richEditor",
              "richEditor": "<p>Related test content.</p>"
            },
            {
              "fieldId": "html",
              "html": "<a href=\"https://related.com\" rel=\"nofollow\">related test link</a>"
            }
          ],
          "description": "related test description",
          "noIndex": false,
          "isAdvertisement": true,
          "thumbnail": {
            "url": "https://example.com/related-thumbnail.jpg",
            "height": 1080,
            "width": 1920
          },
          "category": [
            {
              "id": "relatedCategory",
              "createdAt": "2024-05-30T10:38:16.278Z",
              "updatedAt": "2024-06-04T09:10:16.453Z",
              "publishedAt": "2022-10-09T15:00:00.000Z",
              "name": "related category"
            }
          ],
          "relatedContent": []
        }
      ]
    }
  ],
  "totalCount": 7,
  "offset": 0,
  "limit": 10,
};