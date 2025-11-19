"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      if (data.success && data.image) {
        setImage(`data:image/png;base64,${data.image}`);
      } else {
        throw new Error(data.message || "Failed to generate image");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePrompt = () => {
    setPrompt(
      "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "0.5rem",
            color: "#1f2937",
          }}
        >
          AI Image Generator
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Describe any image and let AI create it for you
        </p>

        <form onSubmit={generateImage} style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... (e.g., A cute cat wearing a hat in space)"
              rows="3"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              disabled={loading}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              style={{
                backgroundColor: loading ? "#9ca3af" : "#3b82f6",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>

            <button
              type="button"
              onClick={handleExamplePrompt}
              disabled={loading}
              style={{
                backgroundColor: "transparent",
                color: "#3b82f6",
                padding: "12px 24px",
                border: "1px solid #3b82f6",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Use Example Prompt
            </button>
          </div>
        </form>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            <strong>Error: </strong>
            {error}
          </div>
        )}

        {image && (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#1f2937",
              }}
            >
              Generated Image
            </h2>
            <div
              style={{
                textAlign: "center",
                border: "2px dashed #d1d5db",
                borderRadius: "12px",
                padding: "1rem",
                backgroundColor: "#f9fafb",
              }}
            >
              <img
                src={image}
                alt="Generated by AI"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
