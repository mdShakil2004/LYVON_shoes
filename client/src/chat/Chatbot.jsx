import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaTimes, FaPaperPlane } from "react-icons/fa";
import { MdCallEnd, MdCall } from "react-icons/md";
import { agent_images } from "../assets/chat";

/**
 * Frontend-only Chatbot component
 * - Chat mode: text-only (OpenRouter)
 * - Voice mode: browser STT -> OpenRouter -> SarvamAI TTS -> play audio
 *
 * Put your API keys below (or use env during dev). Exposing keys on client is insecure for production.
 */

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("chat"); // "chat" | "voice"
  const [talking, setTalking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text:
        "Welcome to LyVON! I'm your luxury shopping assistant. How may I help you with your premium footwear needs today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [callTime, setCallTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  // refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const sentenceBuffer = useRef("");
  const audioQueue = useRef([]);
  const playingRef = useRef(false);

  // -------------------------
  // CONFIGURE YOUR KEYS HERE

  // -------------------------
 const OPENROUTER_API_KEY = import.meta.env.VITE_OPEN_ROUTER_API;
  const SARVAM_API_KEY = import.meta.env.VITE_TTS_API;
  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // call timer
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setCallTime((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // ===== Browser Speech → Text (STT) =====
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setTalking(true);
      setTimerActive(true);
      setCallTime(0);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // send immediately to AI
      handleSendMessage(transcript);
    };

    recognition.onerror = (ev) => {
      // console.error("Speech recognition error:", ev);
      setTalking(false);
      setTimerActive(false);
      setMessages((p) => [
        ...p,
        {
          sender: "assistant",
          text:
            "Sorry, I couldn't understand. Please try again or switch to text mode.",
        },
      ]);
    };

    recognition.onend = () => {
      setTalking(false);
      setTimerActive(false);
    };

    recognition.start();
  };

  // ===== OpenRouter call (get AI text response) =====
  const getAIResponse = async (prompt) => {
    const payload = {
      model: "name",
      messages: [
        {
          role: "system",
          content:
            "You are LyVON assistant — concise, helpful, luxury shopping assistant.",
        },
        { role: "user", content: prompt },
      ],
    };

    const res = await fetch("hideen", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`OpenRouter error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    // Safety: check structure
    if (data?.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    // fallback
    return data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
  };

  // ===== SarvamAI TTS queue (voice mode) =====
  const queueSpeak = async (text) => {
    if (!text || !text.trim()) return;
    try {
      // request tts (returns mp3 binary)
      const res = await fetch("hide", {
        method: "POST",
        headers: {
          "x-api-key": SARVAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tavus:v1",
          input: text,
          voice: "female",
          output_format: "mp3",
        }),
      });

      if (!res.ok) throw new Error("Sarvam TTS failed");

      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audioQueue.current.push({ audio, url });
      // if nothing playing, start
      if (!playingRef.current) playNext();
    } catch (err) {
      // console.error("Sarvam TTS error, falling back to speechSynthesis:", err);
      // fallback to browser TTS for this text
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const playNext = () => {
    if (audioQueue.current.length === 0) {
      playingRef.current = false;
      return;
    }
    playingRef.current = true;
    const { audio, url } = audioQueue.current[0];

    // play and clean after end
    audio.play().catch((e) => {
      
      cleanupAndShift(url);
      playNext();
    });

    audio.onended = () => {
      cleanupAndShift(url);
      playNext();
    };

    audio.onerror = (e) => {
      
      cleanupAndShift(url);
      playNext();
    };
  };

  const cleanupAndShift = (url) => {
    // revoke url and shift
    try {
      URL.revokeObjectURL(url);
    } catch {}
    audioQueue.current.shift();
    if (audioQueue.current.length === 0) playingRef.current = false;
  };

  // ===== process and speak chunks (for more natural flow) =====
  const processTextForVoice = async (fullText) => {
    // break into sentences (simple)
    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    // push each sentence to TTS queue sequentially
    for (const s of sentences) {
      // small throttle: avoid hammering TTS with many tiny requests; this is client-side so keep modest
      await queueSpeak(s);
      // don't await playback, queueSpeak already enqueues; continue to enqueue next.
      // Optional small delay to allow TTS server to handle concurrency:
      await new Promise((r) => setTimeout(r, 120));
    }
  };

  // ===== send message handler (used by chat & voice STT result) =====
  const handleSendMessage = async (messageText = input) => {
    if (!messageText || !messageText.trim()) return;
    setMessages((p) => [...p, { sender: "user", text: messageText }]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const aiText = await getAIResponse(messageText);

      // chat mode: show AI text only
      setMessages((p) => [...p, { sender: "assistant", text: aiText }]);
      setIsLoading(false);

      if (mode === "voice") {
        setStreamingMessage(aiText); // show while TTS queues
        // For voice mode, use Sarvam TTS for each sentence
        await processTextForVoice(aiText);
        setStreamingMessage("");
      }
    } catch (err) {
      // console.error("Error handling message:", err);
      setMessages((p) => [
        ...p,
        { sender: "assistant", text: "Sorry, something went wrong. Try again." },
      ]);
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  // sendMessage wrapper (UI button)
  const sendMessage = () => {
    handleSendMessage(input);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // cleanup on close
  useEffect(() => {
    return () => {
      // stop recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      // revoke queued audio
      audioQueue.current.forEach((a) => {
        try {
          URL.revokeObjectURL(a.url);
        } catch {}
      });
      audioQueue.current = [];
    };
  }, []);

  // UI render (kept mostly like your original)
  return (
    <div className="z-[9999] ">
      {!open && (
        <div className="fixed bottom-6 right-6 !z-[999] ">
          <div className="relative">
            <div className="absolute -top-10 -left-4 bg-white text-black px-3 py-1 rounded-full shadow-md text-sm font-medium">
              Hi! 👋
            </div>
            <button
              onClick={() => setOpen(true)}
              className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-yellow-400"
            >
              <img
                src={agent_images.agent_1}
                alt="Assistant"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 w-96 rounded-2xl shadow-lg bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/80 to-yellow-600/80 text-white">
            <div className="flex items-center gap-3">
              <img
                src={agent_images.agent_1}
                alt="LyVON Assistant"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div>
                <div className="font-semibold flex items-center gap-1">
                  LyVON Assistant
                  <span className="bg-yellow-800 text-xs px-1 py-0.5 rounded">AI</span>
                </div>
                <div className="text-sm">Your Luxury Shopping Assistant</div>
              </div>
            </div>

            <div className="flex gap-3 text-lg">
              <MdCall
                className="cursor-pointer hover:text-green-300"
                onClick={() => {
                  setMode("voice");
                  setTalking(false);
                  setTimerActive(false);
                  setCallTime(0);
                }}
              />
              <FaMicrophone
                className={`cursor-pointer ${talking ? "text-yellow-300" : "hover:text-blue-300"}`}
                onClick={() => {
                  if (!talking) {
                    setTalking(true);
                    setTimerActive(true);
                    setCallTime(0);
                    startListening();
                  } else {
                    setTalking(false);
                    setTimerActive(false);
                    if (recognitionRef.current) recognitionRef.current.stop();
                  }
                }}
              />
              <FaTimes
                className="cursor-pointer hover:text-red-300"
                onClick={() => {
                  setOpen(false);
                  setTalking(false);
                  setTimerActive(false);
                  if (recognitionRef.current) recognitionRef.current.stop();
                  // cleanup audioQueue
                  audioQueue.current.forEach((a) => {
                    try {
                      URL.revokeObjectURL(a.url);
                    } catch {}
                  });
                  audioQueue.current = [];
                }}
              />
            </div>
          </div>

          {/* chat mode */}
          {mode === "chat" && (
            <>
              <div className="p-4 h-64 overflow-y-auto space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "assistant" ? "justify-start" : "justify-end"}`}>
                    {msg.sender === "assistant" && (
                      <img src={agent_images.agent_1} alt="assistant" className="w-8 h-8 rounded-full mr-2" />
                    )}
                    <div className={`p-3 rounded-xl max-w-[80%] ${msg.sender === "assistant" ? "bg-white/60 text-gray-800" : "bg-yellow-500 text-white"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <img src={agent_images.agent_1} alt="assistant" className="w-8 h-8 rounded-full mr-2 animate-pulse" />
                    <div className="p-3 rounded-xl bg-white/60 text-gray-800">Thinking...</div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 flex gap-2 border-t border-white/30 bg-white/40">
                <input
                  className="flex-1 border rounded-xl px-3 py-2 bg-white/70"
                  placeholder="Ask about orders, payments, returns..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button onClick={sendMessage} className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-xl" disabled={isLoading}>
                  <FaPaperPlane />
                </button>
              </div>
              <button className="w-full py-2 text-blue-500 hover:underline" onClick={() => setMode("voice")}>
                Switch to Voice Mode 🎙️
              </button>
            </>
          )}

          {/* voice mode */}
          {mode === "voice" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-6">
              <img src={agent_images.agent_3} alt="assistant" className="w-24 h-24 rounded-full border-4 border-yellow-500" />
              <div className="text-xl font-semibold text-white">LyVON Assistant</div>
              <div className="text-sm text-white/80">Your Luxury Shopping Assistant</div>
              <div className="text-lg font-mono text-white">{formatTime(callTime)}</div>

              {isLoading && (
                <div className="p-3 rounded-xl bg-white/60 text-gray-800">
                  {streamingMessage || "Thinking..."}
                </div>
              )}

              {talking && (
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></span>
                </div>
              )}

              <div className="flex gap-6">
                <button
                  className={`p-4 rounded-full text-white ${talking ? "bg-yellow-500 hover:bg-yellow-600" : "bg-white/40 text-gray-700 hover:bg-white/60"}`}
                  onClick={() => {
                    if (!talking) {
                      setTalking(true);
                      setTimerActive(true);
                      setCallTime(0);
                      startListening();
                    } else {
                      setTalking(false);
                      setTimerActive(false);
                      if (recognitionRef.current) recognitionRef.current.stop();
                    }
                  }}
                >
                  <FaMicrophone />
                </button>

                <button
                  className="bg-red-500 p-4 rounded-full text-white hover:bg-red-600"
                  onClick={() => {
                    setMode("chat");
                    setTimerActive(false);
                    setTalking(false);
                    if (recognitionRef.current) recognitionRef.current.stop();
                    // cleanup audio queue
                    audioQueue.current.forEach((a) => {
                      try {
                        URL.revokeObjectURL(a.url);
                      } catch {}
                    });
                    audioQueue.current = [];
                  }}
                >
                  <MdCallEnd />
                </button>
              </div>

              <button className="mt-4 text-blue-300 hover:underline" onClick={() => setMode("chat")}>
                Switch to Text Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
