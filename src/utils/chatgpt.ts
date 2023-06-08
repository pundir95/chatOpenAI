import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);
