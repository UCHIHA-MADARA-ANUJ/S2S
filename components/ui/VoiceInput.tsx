"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface VoiceInputProps {
  /** Called with the final transcript */
  onResult: (text: string) => void;
  /** Optional: target language (BCP-47) */
  lang?: string;
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Button-only mode (no input) */
  standalone?: boolean;
  /** Optional className */
  className?: string;
  /** Optional aria-label */
  ariaLabel?: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceInput({ onResult, lang = "en-IN", size = "md", standalone = true, className = "", ariaLabel = "Voice input" }: VoiceInputProps) {
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang;
    rec.onresult = (e: any) => {
      let final = "";
      let inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else inter += r[0].transcript;
      }
      if (inter) setInterim(inter);
      if (final) {
        setTranscript((prev) => (prev ? prev + " " : "") + final.trim());
        setInterim("");
        onResult((transcriptRef.current + " " + final).trim());
      }
    };
    rec.onerror = (e: any) => {
      setError(e.error || "Speech recognition error");
      setRecording(false);
      toast.error(`Mic error: ${e.error || "unknown"}`);
    };
    rec.onend = () => {
      setRecording(false);
      setInterim("");
    };
    recRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, [lang, onResult]);

  const transcriptRef = useRef("");
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  const start = async () => {
    if (!recRef.current) return;
    setError(null);
    setTranscript("");
    setInterim("");
    try {
      // Request mic permission
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
        } catch (e: any) {
          setError("Microphone permission denied");
          toast.error("Please allow microphone access");
          return;
        }
      }
      recRef.current.start();
      setRecording(true);
    } catch (e: any) {
      setError(e?.message || "Failed to start");
      toast.error("Couldn't start recording");
    }
  };

  const stop = () => {
    try { recRef.current?.stop(); } catch {}
    setRecording(false);
  };

  const clear = () => {
    setTranscript("");
    setInterim("");
    onResult("");
  };

  if (!supported) {
    return (
      <div className={`inline-flex items-center gap-1 text-xs text-text-muted ${className}`} title="Voice input not supported in this browser">
        <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Voice not supported</span>
      </div>
    );
  }

  const sizeMap = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-11 h-11" };
  const iconMap = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={recording ? stop : start}
        aria-label={recording ? "Stop recording" : ariaLabel}
        aria-pressed={recording}
        className={`relative ${sizeMap[size]} rounded-full flex items-center justify-center transition-all ${
          recording ? "bg-error text-white" : error ? "bg-warning/20 text-warning" : "bg-white/10 text-text-secondary hover:bg-white/20 hover:text-white"
        }`}
      >
        {recording && (
          <motion.span
            className="absolute inset-0 rounded-full bg-error"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
        {recording ? <Mic className={iconMap[size]} aria-hidden="true" /> : <Mic className={iconMap[size]} aria-hidden="true" />}
      </button>
      {standalone && (recording || transcript) && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            role="status"
            aria-live="polite"
          >
            {recording && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" /> Listening…</span>}
            {transcript && <span className="text-sm max-w-[200px] truncate">{transcript}</span>}
            {interim && <span className="text-sm text-text-muted italic">{interim}</span>}
            <button onClick={clear} aria-label="Clear" className="ml-1 p-0.5 rounded hover:bg-white/10">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        </AnimatePresence>
      )}
      {error && (
        <span className="text-xs text-warning flex items-center gap-1">
          <AlertCircle className="w-3 h-3" aria-hidden="true" /> {error}
        </span>
      )}
    </div>
  );
}
