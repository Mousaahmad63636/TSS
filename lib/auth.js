import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

// Helper to check if user is authenticated on the server side
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

// Helper to redirect if not authenticated (server-side)
export async function requireAuth(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=' + encodeURIComponent(context.resolvedUrl),
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}