import { useState } from "react";
import axios from 'axios'; 


 interface PromptRequest {
    prompt: string;
}

  interface PromptResponse {
    response: string;
  }


  export default function BackendConnection() {
      const [input,setInput] = useState<string>("")
      const [loading,setLoading] = useState(false)
      const [response,setResponse] = useState<string>("")

      const handleSubmit = async (e: React.SubmitEvent) => {
          e.preventDefault();

          if (!input.trim()) return

          setLoading(true);
          setResponse("")



        try {

          const requestData: PromptRequest = {
            prompt: input
          };

          const response = axios.post("http://localhost:8000/api/prompt",requestData)

          // const response = await fetch("http://localhost:8000/api/prompt", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(requestData)
          // });

          if (!response) {
            throw new Error(`Server returned ${response.status}`);
          }

          const data: PromptResponse = response.data;
          setResponse(data.response);

        } catch (error) {

          console.error("Error sending prompt:", error);
          setResponse("Failed to fetch response from server.");

        } finally {
          setLoading(false);
        }
      };

        return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        placeholder="Input Text Here" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        />
        <button type="submit" disabled={loading}>{loading ? "submitting..." : "Submit"}</button>
      </form>
    { response && (
      <div>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    )}
    </>
  );
    }