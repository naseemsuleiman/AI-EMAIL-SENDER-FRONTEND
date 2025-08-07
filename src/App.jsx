import { useState } from 'react'
import './App.css'

function App() {
  const [recipients, setRecipients] = useState('')
  const [prompt, setPrompt] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [subject, setSubject] = useState('AI Generated Email')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // ✅ Your backend URL
  const API_BASE = "https://ai-email-sender-6ejm.onrender.com"

  const generateEmail = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }
    
    setIsGenerating(true)
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      setEmailContent(data.content)
    } catch (error) {
      alert('Failed to generate email')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendEmail = async () => {
    if (!recipients.trim() || !emailContent.trim()) {
      alert('Please fill in all required fields')
      return
    }
    
    setIsSending(true)
    try {
      await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipients.split(',').map(r => r.trim()),
          subject,
          content: emailContent
        })
      })
      alert('Email sent successfully!')
    } catch (error) {
      alert('Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Email Assistant</h1>
        <p className="app-subtitle">Generate and send emails with AI</p>
      </header>

      <div className="input-group">
        <label htmlFor="recipients">Recipients (comma separated)</label>
        <input
          id="recipients"
          type="text"
          placeholder="john@example.com, jane@example.com"
          value={recipients}
          onChange={e => setRecipients(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="prompt">Email Prompt</label>
        <textarea
          id="prompt"
          rows="3"
          placeholder="Write a professional email requesting a meeting next week..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button 
          className="generate-btn"
          onClick={generateEmail}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Email'}
        </button>
      </div>

      <div className="input-group">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="content">Email Content</label>
        <textarea
          id="content"
          rows="8"
          value={emailContent}
          onChange={e => setEmailContent(e.target.value)}
        />
      </div>

      <button 
        className="send-btn"
        onClick={sendEmail}
        disabled={isSending || !emailContent.trim()}
      >
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
    </div>
  )
}

export default App
