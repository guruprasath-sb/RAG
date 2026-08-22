import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, Key, CheckCircle, Volume2 } from 'lucide-react';

export default function VoiceStudio({ onProcessVoice, onProcessText, isLoading, currentStrategy, setStrategy, sttProvider, setSttProvider }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);

  const sampleQueries = [
    "What is machine learning?",
    "What is the MSMARCO-XI dataset?",
    "Explain how semantic chunking differs from fixed size chunking?",
    "What are P50, P70, and P100 latency metrics?",
    "Give me the recipe for a delicious pizza." // Triggers Guardrail Refusal
  ];

  useEffect(() => {
    // Initialize Web Speech API for real-time microphone voice transcription
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        if (currentText.trim()) {
          setLiveTranscript(currentText.trim());
          setTextInput(currentText.trim());
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech Recognition info:", err);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      drawWaveform();
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6366f1';
      const bars = 30;
      const width = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * (canvas.height * 0.8) + 5;
        const x = i * width;
        const y = (canvas.height - height) / 2;
        ctx.fillStyle = i % 2 === 0 ? '#6366f1' : '#06b6d4';
        ctx.fillRect(x, y, width - 2, height);
      }

      if (isRecording) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    render();
  };

  const handleStartRecord = () => {
    setLiveTranscript('');
    setIsRecording(true);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    setTimeout(() => {
      const finalQuery = liveTranscript.trim() || textInput.trim() || "What is machine learning?";
      onProcessText(finalQuery, sttProvider, currentStrategy);
    }, 300);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onProcessText(textInput.trim(), sttProvider, currentStrategy);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic style={{ color: '#06b6d4' }} /> Voice Input Studio
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Speak into your microphone or type queries to test sub-200ms E2E Voice RAG.
          </p>
        </div>

        {/* Engine Pickers */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>STT PROVIDER</label>
            <select
              value={sttProvider}
              onChange={(e) => setSttProvider(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none'
              }}
            >
              <option value="Sarvam AI">Sarvam AI (Saaras v1)</option>
              <option value="ElevenLabs">ElevenLabs (Scribe v1)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>CHUNKING STRATEGY</label>
            <select
              value={currentStrategy}
              onChange={(e) => setStrategy(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none'
              }}
            >
              <option value="semantic">Semantic Splitting</option>
              <option value="overlap">Overlapping Window</option>
              <option value="fixed">Fixed-Size (Naive)</option>
              <option value="metadata">Metadata-Aware</option>
              <option value="hierarchical">Hierarchical Parent-Child</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voice Recorder Control Area */}
      <div style={{
        background: 'rgba(10, 12, 20, 0.6)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px border-dashed var(--border-color)',
        marginBottom: '20px'
      }}>
        <button
          className={`mic-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? handleStopRecord : handleStartRecord}
          disabled={isLoading}
        >
          {isRecording ? <Square size={32} color="#fff" /> : <Mic size={36} color="#fff" />}
        </button>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {isRecording ? (
            <div>
              <span className="badge badge-refusal">RECORDING VOICE ({recordingTime}s)</span>
              <p style={{ color: '#06b6d4', fontSize: '0.9rem', marginTop: '8px', fontWeight: '600' }}>
                {liveTranscript ? `Spoken: "${liveTranscript}"` : 'Listening to your microphone... Speak now!'}
              </p>
              <canvas ref={canvasRef} width={200} height={30} style={{ display: 'block', margin: '12px auto 0' }} />
            </div>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Click to Record Voice (Transcribes live speech & processes sub-200ms RAG)
            </p>
          )}
        </div>
      </div>

      {/* Manual Text Query Input */}
      <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Speak into mic or type a question here..."
          style={{
            flex: 1,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn-primary" disabled={isLoading || !textInput.trim()}>
          <Sparkles size={16} /> Execute RAG
        </button>
      </form>

      {/* Quick Sample Queries */}
      <div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginRight: '8px' }}>
          TRY SAMPLE QUERIES:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTextInput(q);
                onProcessText(q, sttProvider, currentStrategy);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '4px 12px',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-color)'}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
