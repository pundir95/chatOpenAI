import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);
