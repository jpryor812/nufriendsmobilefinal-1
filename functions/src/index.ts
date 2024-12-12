import {onCall} from "firebase-functions/v2/https";
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
export { findMatch } from "./matchmaking/findMatch";
export { testUserRead } from './testUserRead';
export { saveSummaries } from './saveSummaries';
export { generateProfileSummaries } from './generateProfileSummaries';
export { generateAllUserSummaries } from './generateAllUserSummaries';
export { generateConversationContent } from './generateChatContent';

const secretManager = new SecretManagerServiceClient();

/** Retrieves OpenAI API key from Secret Manager */
async function getOpenAIKey(): Promise<string | undefined> {
  try {
    const name = "projects/792301576889/secrets/OPENAI_API_KEY";
    const [version] = await secretManager.accessSecretVersion({name});
    return version.payload?.data?.toString();
  } catch (error) {
    console.error("Error fetching secret:", error);
    throw new Error("Could not fetch API key");
  }
}

export const checkKey = onCall({
  memory: "256MiB",
}, async (request) => {
  console.log('Request auth status:', {
    hasAuth: !!request.auth,
    uid: request.auth?.uid,
    provider: request.auth?.token?.firebase?.sign_in_provider
  });

  try {
    const apiKey = await getOpenAIKey();
    return {
      status: "success",
      keyPreview: apiKey?.substring(0, 5) + "...",
      timestamp: new Date().toISOString(),
      authInfo: {
        isAuthenticated: !!request.auth,
        authType: request.auth?.token?.firebase?.sign_in_provider || 'none'
      }
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "An unknown error occurred",
      timestamp: new Date().toISOString(),
    };
  }
});