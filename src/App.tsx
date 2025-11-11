import { useState, useEffect } from "react";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";

function App() {
  const [c1Response, setC1Response] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");

  // Check for URL parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const responseParam = urlParams.get("response");

    if (responseParam) {
      setInputValue(responseParam);
      setC1Response(responseParam);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setC1Response(value);
  };

  const handleClear = () => {
    setInputValue("");
    setC1Response("");
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("response");
    window.history.replaceState({}, "", url.toString());
  };

  const generateShareableUrl = () => {
    if (!inputValue.trim()) return "";

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("response", inputValue);
    return url.toString();
  };

  const copyShareableUrl = async () => {
    const shareableUrl = generateShareableUrl();
    if (shareableUrl) {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        setCopyFeedback("Copied!");
        setTimeout(() => setCopyFeedback(""), 2000);
      } catch (error) {
        console.error("Failed to copy URL:", error);
        setCopyFeedback("Failed to copy");
        setTimeout(() => setCopyFeedback(""), 2000);
      }
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>C1 Paste</h1>
        <p>Paste your C1 response below or use a URL parameter to render it</p>
      </header>

      <div className="input-section">
        <div className="textarea-container">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Paste your C1 response here..."
            className="c1-input"
          />
          <div className="button-group">
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
            {inputValue.trim() && (
              <button onClick={copyShareableUrl} className="share-btn">
                {copyFeedback || "Copy Shareable URL"}
              </button>
            )}
          </div>
        </div>
      </div>

      {c1Response && (
        <div className="output-section">
          <h2>Rendered Output</h2>
          <div className="c1-output">
            <ThemeProvider>
              <C1Component c1Response={c1Response} isStreaming={false} />
            </ThemeProvider>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
