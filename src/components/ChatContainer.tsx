import { ChatCompletionRequestMessage } from "openai";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import CursorSVG from "./icons/CursorSVG";
import Image from "next/image";
import allBirds from "../../public/allbirds.png";
import webyParker from"../../public/warby.png";
import peleton from"../../public/peloton.png";
import aloYoga from"../../public/aloyoga.png";
import gloosies from"../../public/glossier.png";

interface ChatContainerProps {
  chatHistory: ChatCompletionRequestMessage[];
  systemSelectionPrompt: any;
  hitApi: any;
  optionClicked: any;
}

export default function ChatContainer({
  chatHistory,
  systemSelectionPrompt,
  hitApi,
  optionClicked,
}: ChatContainerProps) {
  const [displayResponse, setDisplayResponse] = useState("");
  const [completedTyping, setCompletedTyping] = useState(false);
  const [contentFromHistory, setContentFromHistory] = useState("");

  let chatInterval: any;

  /* this useeffect is called just to make a response slow slow typed response like we are writing text one by one charcter */
  useEffect(() => {
    if (!chatHistory?.length) {
      return;
    }
    setCompletedTyping(false);
    let i = 0;
    const stringResponse = chatHistory[chatHistory.length - 1].content;
    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));
      i++;
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [chatHistory]);

  //this is spliting the displayresponse to make poiints and then those points are conveted to clickables text
  const splitText = displayResponse.split("?");

  const getSource = (text: any):any => {
    if (text == "WarbyParker") {
      return webyParker;
    } else if (text == "Allbirds") {
      return allBirds;
    } else if (text == "Peloton") {
      return peleton;
    } else if (text == "Alo Yoga") {
      return aloYoga;
    } else {
      return gloosies;
    }
  };
  return (
    <div className="max-h-0">
      {/* launched text */}
      <div className="chat chat-start">
        <span className="chat-bubble whitespace-pre-line">
          {chatHistory[0].content}
        </span>
      </div>

      {/* launch options */}
      <div className="chat chat-start">
        <span className="chat-bubble whitespace-pre-line">
          {systemSelectionPrompt?.content}
          <br />
          {systemSelectionPrompt?.brands?.map((item: string, id: number) => {
            return (
              <button
                key={id}
                className="text-gray-900 px-12 mt-3 mb-3 py-1 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-sm text-sm px-4  mr-1 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button"
                onClick={() => hitApi(item)}
              >
                <span className="flex">
                  <Image
                    src={getSource(item)}
                    width={10}
                    height={10}
                    alt="My Image"
                    className=""
                  />
                  
                  <span className="px-3">{item}</span>
                </span>
              </button>
            );
          })}
          <br />
          {systemSelectionPrompt?.endLine}
        </span>
      </div>

      {chatHistory?.map((message, messageIndex) => (
        <div key={messageIndex}>
          {/* this below code is called when user type some message  */}
          {message?.role === "user" && (
            <div className="chat chat-end">
              <span className="chat-bubble whitespace-pre-line">
                {message?.content}
              </span>
            </div>
          )}

          {/*this below code is called when we get current reponse from assistant so this is calledd  */}
          {messageIndex === chatHistory.length - 1 &&
            message?.role === "assistant" && (
              <div className="chat chat-start">
                <span className="chat-bubble whitespace-pre-line">
                  {`${splitText?.[0]}?`}
                  {splitText?.map((item, id) => {
                    if (id == 0) return null;
                    else
                      return (
                        <h6
                          className="mt-1.5 cursor-pointer"
                          onClick={() => optionClicked(item)}
                        >
                          {item.split("- ")[1] != "" &&
                            item.split("- ")[1] != undefined &&
                            `👉 ${item.split("- ")[1]}?` + "\n"}
                        </h6>
                      );
                  })}

                  {/*  {displayResponse} */}
                  {!completedTyping && <CursorSVG />}
                </span>
              </div>
            )}

          {/* this below code is called when chat history loads old chat  */}
          {message?.role === "assistant" &&
            messageIndex !== chatHistory.length - 1 && (
              <div className="chat chat-start">
                <span className="chat-bubble whitespace-pre-line">
                  {message.content.includes("Nice to meet you, welcome to") ? (
                    <>
                      {`${message.content.split("?")[0]}?`}
                      {message.content.split("?").map((item, id) => {
                        if (id == 0) return null;
                        else
                          return (
                            <h6
                              className="mt-1.5 cursor-pointer"
                              onClick={() => optionClicked(item)}
                            >
                              {item.split("- ")[1] != "" &&
                                item.split("- ")[1] != undefined &&
                                `👉 ${item.split("- ")[1]}?` + "\n"}
                            </h6>
                          );
                      })}
                    </>
                  ) : (
                    message?.content //if the text is plain text
                  )}
                </span>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
