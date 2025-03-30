import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const url = new URL(request.url);

  // Hindari redirect loop ke "/signin"
  if (
    isProtectedRoute(request) &&
    !(await convexAuth.isAuthenticated()) &&
    url.pathname !== "/signin"
  ) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }

  // Hindari redirect loop dari "/signin" ke "/" jika sudah login
  if (
    isSignInPage(request) &&
    (await convexAuth.isAuthenticated()) &&
    url.pathname !== "/"
  ) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
