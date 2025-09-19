const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// This is the standard and recommended way to protect routes with Clerk
const clerkAuthMiddleware = ClerkExpressRequireAuth({});

module.exports = { clerkAuthMiddleware };
