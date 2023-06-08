import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);
