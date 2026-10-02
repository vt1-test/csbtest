import { n as createServerFn } from "./ssr.mjs";
import { _n as object, bn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-D47-UuFG.js
var listPublishedQuizzes = createServerFn({ method: "GET" }).handler(createSsrRpc("9537fdb74f5214107b24c7b077aece050484533bddd4edd410ba1268d66b5600"));
var getQuizBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string() })).handler(createSsrRpc("55e6f430b2e0f2a6755fc598b1a1e5fb531f515a91c7736b36b6c3e14c21212c"));
createServerFn({ method: "GET" }).handler(createSsrRpc("25c30f9877ad4b3ee9a578e88aff20184b39c56b41305d633cae024713634ca0"));
//#endregion
export { listPublishedQuizzes as n, getQuizBySlug as t };
