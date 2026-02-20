import { useState, useEffect } from "react";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";

function App() {
  const [c1Response, setC1Response] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [parseError, setParseError] = useState<string>("");

  const decompressAndDecode = async (compressed: string): Promise<string> => {
    if (typeof DecompressionStream === "undefined") {
      throw new Error(
        "Your browser doesn't support URL compression. Please use a modern browser like Chrome, Firefox, or Safari."
      );
    }

    const binaryString = atob(compressed);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });

    const decompressedStream = stream.pipeThrough(
      new DecompressionStream("gzip")
    );
    const reader = decompressedStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const decompressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      decompressed.set(chunk, offset);
      offset += chunk.length;
    }

    const decoder = new TextDecoder();
    return decoder.decode(decompressed);
  };

  // Check for URL parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const compressedParam = urlParams.get("c");

    if (compressedParam) {
      decompressAndDecode(compressedParam)
        .then((decompressed) => {
          setInputValue(decompressed);
          setC1Response(decompressed);
        })
        .catch((error) => {
          console.error("Failed to decompress URL parameter:", error);
          setCopyFeedback("Browser not supported");
          setTimeout(() => setCopyFeedback(""), 3000);
        });
    }
  }, []);

  const unescapeJsString = (str: string): string => {
    return str.replace(/\\(.)/g, (_match, char) => {
      switch (char) {
        case 'n': return '\n';
        case 't': return '\t';
        case 'r': return '\r';
        case '"': return '"';
        case "'": return "'";
        case '\\': return '\\';
        case '`': return '`';
        default: return _match; // Keep unknown escapes as-is
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setC1Response(unescapeJsString(value));
    setParseError(""); // Clear any previous errors
  };

  const handleClear = () => {
    setInputValue("");
    setC1Response("");
    setParseError("");
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("c");
    window.history.replaceState({}, "", url.toString());
  };

  const compressAndEncode = async (text: string): Promise<string> => {
    if (typeof CompressionStream === "undefined") {
      throw new Error(
        "Your browser doesn't support URL compression. Please use a modern browser like Chrome, Firefox, or Safari."
      );
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(data);
        controller.close();
      },
    });

    const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
    const reader = compressedStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const compressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      compressed.set(chunk, offset);
      offset += chunk.length;
    }

    const base64 = btoa(String.fromCharCode(...compressed));
    return base64;
  };

  const generateShareableUrl = async () => {
    if (!inputValue.trim()) return "";

    const compressed = await compressAndEncode(inputValue);
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("c", compressed);
    return url.toString();
  };

  const copyShareableUrl = async () => {
    try {
      const shareableUrl = await generateShareableUrl();
      if (shareableUrl) {
        await navigator.clipboard.writeText(shareableUrl);
        setCopyFeedback("Copied!");
        setTimeout(() => setCopyFeedback(""), 2000);
      }
    } catch (error) {
      console.error("Failed to generate or copy URL:", error);
      if (
        error instanceof Error &&
        error.message.includes("browser doesn't support")
      ) {
        setCopyFeedback("Browser not supported");
      } else {
        setCopyFeedback("Failed to copy");
      }
      setTimeout(() => setCopyFeedback(""), 3000);
    }
  };

  const onC1Error = (error: { code: number; c1Response: string }) => {
    setParseError(`Failed to parse C1 response. Error code: ${error.code}`);
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
          <h2>Rendered Output hello</h2>
          <div className="c1-output">
            <ThemeProvider>
              <C1Component
                c1Response={c1Response.trim()}
                isStreaming={false}
                onError={onC1Error}
              />
            </ThemeProvider>
          </div>
          {parseError && (
            <div
              className="error-message"
              style={{
                padding: "1rem",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "4px",
                color: "#c33",
                marginTop: "1rem",
              }}
            >
              {parseError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
