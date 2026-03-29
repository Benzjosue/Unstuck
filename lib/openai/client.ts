import "server-only";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing environment variable: OPENAI_API_KEY is required."
  );
}

// Server-only OpenAI client — the "server-only" import above causes a build
// error if this module is ever accidentally imported in a client component.
//
// IMPORTANT: Never set the model here. Always set model: "gpt-4o-mini" at the
// call site. Using any other model is a project constitution violation.
export const openai = new OpenAI({ apiKey });
