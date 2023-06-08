import { useCallback, useEffect, useRef, useState } from "react";
import InputControl from "./InputControl";
import { openai } from "@/utils/chatgpt";
import ChatContainer from "./ChatContainer";
import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from "openai";
import Banner from "./Banner";
import WarningAlert from "./WarningAlert";
import ErrorAlert from "./ErrorAlert";

const systemPrompt: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "Hello'! I'm Shoptimus Prime, your personal and friendly AI shopping assistant powered by GPT 3.5. I'm trained on all the information on the entire internet and all of the data from your favorite eCommerce brands. I'm here to make your shopping experience seamless and delight.",
};

const systemSelectionPrompt: any = {
  role: "system",
  content: "Lets start by selecting your favorite DTC eCommerce Brand",
  brands: ["WarbyParker", "Allbirds", "Peloton", "Alo Yoga", "Glossier"],
  endLine: "  ...or type in a topic of your choice below",
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [responseAdded, setResponseAdded] = useState(false);
  const [promptAdded, setPromptAdded] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [showError, setShowError] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    ChatCompletionRequestMessage[]
  >([systemPrompt]);

  const calllingOpenApi = async (newPrompt: any, optiontype: string) => {
    try {
      setLoadingResponse(true);
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        body: JSON.stringify(
          optiontype == "basicChat" ? newPrompt : [...chatHistory, newPrompt]
        ),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseBody = await response.json();
      setResponse(responseBody.chatGptResponse[0].message?.content);
      setResponseAdded(true);
      setPromptAdded(false);
      setLoadingResponse(false);
      setShowError(false);
    } catch (error) {
      setShowError(true);
      setLoadingResponse(false);
    }
  };

  //it hits on very fist time when user choose from buttons
  const getResultFromSelectedButton = async (optionSelected: string) => {
    const newPrompt: ChatCompletionRequestMessage = {
      role: "user",
      content: `These questions should cover a range of topics:
      1) product recommendations to guide shoppers towards chosen a product
      2) questions related to a specific product from their catalog (mention the name of the  ${optionSelected})
      3) general information about the brand 
      4) a fun fact about the brand
      5) a helpful insight or tip related to an activity related to the brand’s products (eg. caraway might have cooking tips and recipes related to their cookware)
      Generate a relevant friendly and witty name for a chatbot assistant for the selected brand.
      Add an opening line in of: “Nice to meet you, welcome to <Name of Brand>. I’m <AI Generated Bot Name>, your personal and friendly AI shoping assistant. I’m trained on all the information on the  ${optionSelected} their entire product catalog, all their user reviews, and much more and list the 5 question seprated by -?. ${optionSelected}`,
    };
    const savedPromptToChat: ChatCompletionRequestMessage = {
      role: "user",
      content: optionSelected,
    };
    setChatHistory((chatHistory) => [...chatHistory, savedPromptToChat]);
    calllingOpenApi(newPrompt, "buttonClicked"); //second argument is just for difrentiating which fn is called in callingopenai
  };

  //this is called when we slect the option from the list given in response by clicking on the button
  const selectionFromMulitploptionHandler = async (choiceSelected: any) => {
    const choiceSelectedRefined = choiceSelected.split("- ")[1];
    const newPrompt: ChatCompletionRequestMessage = {
      role: "user",
      content: choiceSelectedRefined,
    };
    console.log(choiceSelectedRefined, "item serached");
    setChatHistory((chatHistory) => [...chatHistory, newPrompt]);
    calllingOpenApi(newPrompt, "optionSelected");
  };

  //this is called when someone do the normal chat on the chatgpt
  const handleResponse = useCallback(async () => {
    calllingOpenApi(chatHistory, "basicChat");
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory?.length && promptAdded) {
      handleResponse();
    }
  }, [chatHistory, handleResponse, promptAdded]);

  useEffect(() => {
    if (response && responseAdded) {
      const newResponse: ChatCompletionResponseMessage = {
        role: "assistant",
        content: response,
      };
      setChatHistory((chatHistory) => [...chatHistory, newResponse]);
      setResponseAdded(false);
    }
  }, [response, responseAdded]);

  //it maintain the chat history when user normaly chat with ai freely
  const getResponse = async (): Promise<void> => {
    setPromptAdded(true);
    const newPrompt: ChatCompletionRequestMessage = {
      role: "user",
      content: prompt,
    };
    setChatHistory((chatHistory) => [...chatHistory, newPrompt]);
    setPrompt("");
  };

  return (
    <main className="flex min-h-screen flex-col px-4 sm:px-24 gap-y-4 pb-4">
      <Banner />
      <div className="grow overflow-y-auto">
        <ChatContainer
          hitApi={getResultFromSelectedButton}
          systemSelectionPrompt={systemSelectionPrompt}
          chatHistory={chatHistory}
          optionClicked={selectionFromMulitploptionHandler}
        />
      </div>
      {showError && <ErrorAlert setShowError={setShowError} />}
      <InputControl
        setPrompt={setPrompt}
        prompt={prompt}
        getResponse={getResponse}
        loadingResponse={loadingResponse}
      />
      {/*  {showWarning && <WarningAlert setShowWarning={setShowWarning} />} */}
    </main>
  );
}
