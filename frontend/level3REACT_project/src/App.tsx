import { useState } from 'react'
import './App.css'ww

function App() {

  interface PromptRequest {
    prompt: string;
  }

  const [input,setInput] = useState("")
  const [loading,setLoading] = useState(false)
  const [response,setResponse] = useState("")

// so there are 3 states it need to remember
// 1.remember the of what the textatea/input box contain
// 2.the response from the backend
// 3.boolean to see whether its loading or finished/not loading

  const handleSubmit = () => {
      if (!input.trim()) return

      setLoading(true);
      setResponse("")

    try {
      const res = await fetch("http://localhost:/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(" prompt: input"),
      })

      if (!res.ok) {
        throw new Error(`Server returned ${{res.status}}`)
      }

      const data = await res.json()
      setResponse(data.message || data.reply || JSON.stringify(data))
    } catch (error) {
      console.error("Error sending prompt:", error)
      setResponse("Failed to fetch response from server.")
    } finally {
      setLoading(false)
    }
  }




  return (
    <>
      <div>
        <div>
          <input 
          type="text" 
          placeholder="Input Text Here" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          />
          <button onClick={handleSubmit} disabled={loading}>{loading ? "submitting..." : "Submit"}</button>

        </div>
        { response && (
          <div>
            <strong>Response:</strong>
            <p>{response}</p>
          </div>
        )
        }
      </div>
    </>
  )
}

export default App
