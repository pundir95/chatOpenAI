import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);
