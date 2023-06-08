import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);
