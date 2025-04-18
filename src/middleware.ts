import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/(.*)"]);
const isPublicRoute = createRouteMatcher(["/invite/(.*)"]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const url = new URL(request.url);
    // Jika termasuk public route, tidak perlu cek autentikasi
    if (isPublicRoute(request)) {
      return;
    }
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
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 7 } },
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
