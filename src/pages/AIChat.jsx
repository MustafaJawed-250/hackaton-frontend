import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Bot, User } from 'lucide-react';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your HCM assistant powered by Groq. Ask me about headcount, attendance, leave balances, or company policies.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', {
        messages: next.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.data.reply,
          toolsUsed: data.data.toolsUsed,
          isAiGenerated: true,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err.response?.data?.message || 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 800 }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">AI Assistant</h1>
          <p className="page-subtitle">Live data · Groq · Role-aware tools</p>
        </div>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {messages.map((m, i) => (
            <div
              key={i}
              className="animate-in"
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1.1rem',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="var(--text-secondary)" />}
              </div>
              <div style={{
                maxWidth: '75%',
                padding: '0.7rem 1rem',
                borderRadius: 12,
                background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-muted)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                fontSize: '0.92rem',
                lineHeight: 1.55,
              }}>
                {m.content}
                {m.toolsUsed?.length > 0 && (
                  <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 6 }}>
                    Tools: {m.toolsUsed.join(', ')}
                  </div>
                )}
                {m.isAiGenerated && (
                  <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 4 }}>AI-generated</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div className="spinner" style={{ width: 16, height: 16 }} /> Thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} style={{
          display: 'flex', gap: 8, padding: '0.85rem 1rem',
          borderTop: '1px solid var(--border)',
        }}>
          <input
            className="form-input"
            placeholder="Ask about headcount, leave, attendance…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
