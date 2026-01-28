import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Input } from "antd";
import {
  DownloadOutlined,
  SendOutlined,
  DownOutlined,
  ShrinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { APIService } from "../../config/api/apiConfig";

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content:
        "Hello 👋, I'm here to help you with any questions you may have on your Wyre Dashboard",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // New feature states
  const [topic, setTopic] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "What is my total energy usage?",
    "Which branch is contributing more to diesel consumption?",
    "Show total cost breakdown by branch for last month",
  ]);
  const [promptsVersion, setPromptsVersion] = useState(0);

  const chatRef = useRef(null);
  const widgetRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? Your AI chat session will be lost.";
      return "Are you sure you want to leave? Your AI chat session will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const downloadChatAsPDF = async () => {
    setIsLoading(true);
    setIsDownloading(true);
    setDownloadError(null);

    try {
      if (isLoading) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ensure the chat container is fully scrollable
      const chatElement = chatRef.current;
      const originalStyle = {
        overflowY: chatElement.style.overflowY,
        height: chatElement.style.height,
      };

      // Temporarily set the chat container to display all content
      chatElement.style.overflowY = "visible";
      chatElement.style.height = "auto";

      // Create canvas with full scroll height
      const canvas = await html2canvas(chatElement, {
        scale: 2,
        height: chatElement.scrollHeight,
        width: chatElement.offsetWidth,
        scrollX: 0,
        scrollY: 0,
      });

      // Restore original styles
      chatElement.style.overflowY = originalStyle.overflowY;
      chatElement.style.height = originalStyle.height;

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const titleHeight = 20;
      const usablePageHeight = pageHeight - margin - titleHeight;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfImgWidth = pageWidth - 2 * margin;
      const pixelsPerMm = imgWidth / pdfImgWidth;

      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      const pdfTitle = topic ? `Wyre AI • ${topic}` : "Wyre AI Chat History";
      pdf.text(pdfTitle, pageWidth / 2, margin + 10, {
        align: "center",
      });

      // Paginate content
      let yOffset = 0;
      let pageCount = 1;

      while (yOffset < imgHeight) {
        if (pageCount > 1) {
          pdf.addPage();
          pdf.setFontSize(20);
          pdf.setTextColor(0, 0, 0);
        }

        // Create a temporary canvas for cropping
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = imgWidth;
        tempCanvas.height = Math.min(
          usablePageHeight * pixelsPerMm,
          imgHeight - yOffset
        );

        // Draw the cropped portion
        tempCtx.drawImage(
          canvas,
          0,
          yOffset,
          imgWidth,
          tempCanvas.height,
          0,
          0,
          imgWidth,
          tempCanvas.height
        );
        const croppedImgData = tempCanvas.toDataURL("image/png");

        // Add cropped image to PDF
        const croppedImgHeight = tempCanvas.height / pixelsPerMm;
        pdf.addImage(
          croppedImgData,
          "PNG",
          margin,
          margin + titleHeight,
          pdfImgWidth,
          croppedImgHeight
        );

        yOffset += usablePageHeight * pixelsPerMm;
        pageCount++;
      }

      pdf.save("wyre_ai_chat_history.pdf");
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      setDownloadError("Failed to generate PDF. Please try again.");
      setIsLoading(false);
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const question = inputValue;
    setInputValue("");
    await sendQuestion(question);
  };

  const handleSuggestedQuestion = (question) => {
    if (isTyping) return;
    sendQuestion(question);
  };

  const sendQuestion = async (question) => {
    const trimmed = (question || "").trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      // Keep existing endpoint intact
      const response = await APIService.post("/chatbot/chat/branch/", {
        question: trimmed,
        session_id: sessionId,
      });

      const responseData = response?.data?.data || {};
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responseData.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setSessionId(responseData.session_id);

      // New: capture topic and dynamic prompts if provided
      if (!topic && responseData.topic) {
        setTopic(responseData.topic);
      }
      if (
        Array.isArray(responseData.suggested_prompts) &&
        responseData.suggested_prompts.length > 0
      ) {
        setSuggestedPrompts(responseData.suggested_prompts);
        setPromptsVersion((v) => v + 1);
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "40px",
          width: "50px",
          height: "50px",
          backgroundColor: "#5C3592",
          borderColor: "#5C3592",
          fontSize: "18px",
          fontWeight: "500",
          zIndex: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s ease",
          transform: isOpen ? "scale(0)" : "scale(1)",
          opacity: isOpen ? 0 : 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <img
          src="/icon/wyre-ai-logo.svg"
          alt="Wyre Ai Logo"
          style={{ width: "30px", height: "30px" }}
        />
      </Button>
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "40px",
          width: "50px",
          height: "50px",
          backgroundColor: "#5C3592",
          borderColor: "#5C3592",
          fontSize: "18px",
          fontWeight: "bold",
          zIndex: 40,
          transition: "all 0.3s ease",
          transform: !isOpen ? "scale(0)" : "scale(1)",
          opacity: !isOpen ? 0 : 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <DownOutlined />
      </Button>

      {/* Chat Widget */}
      <div
        ref={widgetRef}
        style={{
          position: "fixed",
          bottom: "80px",
          right: "40px",
          width: "420px",
          height: "80%",
          // backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          transition: "all 0.3s ease-in-out",
          zIndex: 50,
          transform: isOpen
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(16px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#5C3592",
            color: "white",
            padding: "12px",
            height: "60px",
            borderRadius: "8px 8px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Button
              type="text"
              size="small"
              icon={<ShrinkOutlined style={{ fontSize: "20px" }} />}
              onClick={() => setIsOpen(false)}
              style={{
                color: "white",
                border: "none",
                padding: "0",
                width: "24px",
                height: "24px",
                minWidth: "24px",
              }}
            />
            <p
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              {topic || "Wyre AI Dashboard Assistant"}
            </p>
          </div>
          <DownloadOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={downloadChatAsPDF}
            disabled={isLoading}
          />
          {downloadError && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "8px" }}>
              {downloadError}
            </div>
          )}
        </div>

        <div
          ref={chatRef}
          style={{
            flex: 1,
            padding: "12px",
            overflowY: "auto",
            backgroundColor: !isDownloading ? "rgb(247,235,251, 0.5)" : "white",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {!isDownloading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 550,
                  letterSpacing: "0.5px",
                  color: "gray",
                }}
              >
                Wyre AI Chat
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  color: "gray",
                  marginTop: "4px",
                }}
              >
                <InfoCircleOutlined
                  style={{ fontSize: "12px", marginRight: "6px" }}
                />
                Please Ask Questions Related to Wyre
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === "ai" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "#5C3592",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src="/icon/wyre-ai-logo.svg"
                      alt="Wyre Ai Logo"
                      style={{ width: "15px", height: "15px" }}
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      maxWidth: "200px",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #b9b9b9",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        lineHeight: "1.4",
                        wordBreak: "break-word",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      backgroundColor: "#5C35922B",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      border: "1px solid #b9b9b9",
                      maxWidth: "200px",
                    }}
                  >
                    <p style={{ fontSize: "12px", wordBreak: "break-word" }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </p>
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    message.type === "user" ? "flex-end" : "flex-start",
                  marginTop: "4px",
                }}
              >
                <p style={{ color: "#999", fontSize: "10px" }}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#5C3592",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/icon/wyre-ai-logo.svg"
                  alt="Wyre Ai Logo"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  height: "40px",
                  padding: "40px 18px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#ccc",
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#ccc",
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite ease-in-out 0.16s",
                    }}
                  />
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#ccc",
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite ease-in-out 0.32s",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "rgb(247,235,251, 0.5)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid #d9d9d9",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {suggestedPrompts.map((prompt, index) => (
            <Button
              key={`${prompt}-${index}-${promptsVersion}`}
              size="small"
              onClick={() => handleSuggestedQuestion(prompt)}
              disabled={isTyping}
              style={{
                textAlign: "left",
                height: "auto",
                padding: "8px 12px",
                borderRadius: "16px",
                backgroundColor: isTyping ? "#f5f5f5" : "white",
                border: "1px solid #d9d9d9",
                fontSize: "12px",
                color: isTyping ? "#ccc" : "#666",
                whiteSpace: "normal",
                lineHeight: "1.3",
                width: "fit-content",
                opacity: 0,
                animation: "fadeInUp 280ms ease-out forwards",
                animationDelay: `${index * 80}ms`,
                cursor: isTyping ? "not-allowed" : "pointer",
              }}
            >
              {prompt}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "white",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => !isTyping && setInputValue(e.target.value)}
            onPressEnter={!isTyping ? handleSendMessage : undefined}
            placeholder={
              isTyping ? "Wyre AI is responding..." : "Ask Wyre AI anything..."
            }
            disabled={isTyping}
            suffix={
              <Button
                type="primary"
                size="small"
                shape="circle"
                color="#5C3592"
                icon={<SendOutlined size={34} />}
                onClick={!isTyping ? handleSendMessage : undefined}
                disabled={!inputValue.trim() || isTyping}
                style={{
                  // backgroundColor: "#5C3592",
                  // borderColor: "#5C3592",
                  width: "34px",
                  height: "34px",
                  minWidth: "34px",
                  opacity: isTyping ? 0.5 : 1,
                }}
              />
            }
            style={{
              borderRadius: "20px",
              backgroundColor: isTyping ? "#f0f0f0" : "#fafafa",
              fontSize: "12px",
              paddingRight: "4px",
              cursor: isTyping ? "not-allowed" : "text",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
