import { useState } from "react";
import { toast } from "react-toastify";
import { api, errorHandler } from "../authentification/api";
import * as ui from "../../ui";

type PromptResponse = {
  response: string;
};

export default function BackendConnection() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");
    setIsError(false);

    try {
      const result = await api.post<PromptResponse>("/api/prompt", {
        prompt: input,
      });
      setResponse(result.data.response);
    } catch (error) {
      setIsError(true);
      setResponse(errorHandler(error));
      toast.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={ui.panel}>
      <div className={ui.panelTitle}>
        <h2 className={ui.h2}>Oracle</h2>
        <span className={ui.badge("gold")}>AI</span>
      </div>

      <form className={ui.formRowTight} onSubmit={handleSubmit}>
        <input
          type="text"
          className={ui.input}
          placeholder="Ask the oracle…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className={ui.button("primary")}
          disabled={loading}
        >
          {loading ? "Consulting…" : "Ask"}
        </button>
      </form>

      {response && (
        <div className={ui.message(isError)}>
          <p className={ui.preWrap}>{response}</p>
        </div>
      )}
    </section>
  );
}
