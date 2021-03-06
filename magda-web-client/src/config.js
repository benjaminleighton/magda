// @flow
import Publisher from "./SearchFacets/Publisher";
import Format from "./SearchFacets/Format";
import Region from "./SearchFacets/Region";
import Temporal from "./SearchFacets/Temporal";

const fallbackApiHost = "http://magda-dev.terria.io/";

const serverConfig = window.magda_server_config || {};

const registryApiUrl =
  serverConfig.registryApiBaseUrl || fallbackApiHost + "api/v0/registry/";
const previewMapUrl = serverConfig.previewMapBaseUrl || fallbackApiHost + "preview-map/";
const proxyUrl = previewMapUrl + "proxy/";

const adminApiUrl = "http://magda-dev.terria.io/api/v0/admin/"

export const config = {
  appName: "data.gov.au",
  baseUrl: serverConfig.baseUrl || fallbackApiHost,
  searchApiUrl:
    serverConfig.searchApiBaseUrl || fallbackApiHost + "api/v0/search/",
  registryApiUrl: registryApiUrl,
  adminApiUrl: adminApiUrl,
  authApiUrl: serverConfig.authApiBaseUrl || fallbackApiHost + "api/v0/auth/",
  discussionsApiUrl:
    serverConfig.discussionsApiBaseUrl ||
    fallbackApiHost + "api/v0/discussions/",
  previewMapUrl: previewMapUrl,
  proxyUrl: proxyUrl,
  rssUrl: proxyUrl + "_0d/https://blog.data.gov.au/blogs/rss.xml",
  facetListSize: 5,
  resultsPerPage: 10,
  descriptionLength: 50,
  downloadLinksSize: 3,
  disableAuthenticationFeatures:
    serverConfig.disableAuthenticationFeatures || false,
  breakpoints: {
    small: 768,
    medium: 992,
    large: 1200
  },
  appTitle: 'Australian open data search',
  featuredDatasets: [
    "19432f89-dc3a-4ef3-b943-5326ef1dbecc",
    "bdcf5b09-89bc-47ec-9281-6b8e9ee147aa"
  ],
  exampleSearch: [
    "Business names as CSV",
    "Geocoded National Address File",
    "By Australian Charities and Not-for-profits Commission",
    "Statistics from 2013 by Australian Taxation Office",
    "Trees in SA2:201011002",
    "Budget from 2016 to 2017 by Department of Finance",
    "Planning as WMS"
  ],
  suggestion: [
    "Business names as CSV",
    "Statistics  by Australian Taxation Office from 2013",
    "Trees in SA2:201011002"
  ],
  facets: [
    { id: "publisher", component: Publisher },
    { id: "region", component: Region },
    { id: "temporal", component: Temporal },
    { id: "format", component: Format }
  ],
  headerNavigation: [
    ["Search", "search"],
    ...(serverConfig.disableAuthenticationFeatures
      ? []
      : [["Projects", "projects"]]),
    ["Publishers", "publishers"],
    ["About", "page/about"]
  ],
  footerNavigation: [
    {
      category: "Search",
      links: [
        ["Data sources", "page/data-sources"],
        ["Search syntax", "page/search-syntax"]
      ]
    },
    ...(serverConfig.disableAuthenticationFeatures
      ? []
      : [
          {
            category: "Projects",
            links: [
              ["Browse projects", "projects"],
              ["Start a project", "project/new"]
            ]
          }
        ]),
    {
      category: "Publishers",
      links: [
        ["Publisher index", "publishers"],
        ["Open data toolkit", "https://toolkit.data.gov.au/"]
      ]
    },
    {
      category: "Developers",
      links: [
        ["Architecture", "page/architecture"],
        ["API Docs", registryApiUrl + "swagger/index.html"]
      ]
    },
    {
      category: "About",
      links: [
        ["About data.gov.au", "page/about"],
        ["Blog", "https://blog.data.gov.au/"]
      ]
    },
    { category: "Feedback", links: [["Feedback", "http://preview.data.gov.au/feedback.html"]] }
  ]
};
