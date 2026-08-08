import React, { useState } from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { Mic, MicOff, Sparkles, RefreshCw } from 'lucide-react';
import { getApiBaseUrl } from '../../config';

interface VoiceInputButtonProps {
  onTranscriptChange: (text: string) => void;
  patientName?: string;
  placeholder?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscriptChange,
  patientName = 'Patient',
  placeholder = 'Speak your note aloud...'
}) => {
  const { isListening, transcript, isSupported, startListening, stopListening } = useVoiceInput();
  const [isRestructuring, setIsRestructuring] = useState(false);

  // Sync transcript to parent as user speaks
  React.useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleAIRestructure = async () => {
    if (!transcript && !isListening) return;
    setIsRestructuring(true);
    const apiBase = getApiBaseUrl();

    try {
      const res = await fetch(`${apiBase}/api/gemini/parse-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: transcript || 'Patient visited with fever and cough.',
          patientName
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.whatsappMessage) {
          onTranscriptChange(data.whatsappMessage);
        } else if (data.prescription) {
          onTranscriptChange(data.prescription);
        }
      }
    } catch (err) {
      console.warn('AI restructuring failed, keeping raw transcript:', err);
    } finally {
      setIsRestructuring(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2 my-1">
      <button
        type="button"
        onClick={toggleMic}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isListening
            ? 'bg-red-500 text-white animate-pulse shadow-md'
            : 'bg-[#0F5C56]/10 text-[#0F5C56] hover:bg-[#0F5C56] hover:text-white border border-[#0F5C56]/20'
        }`}
        title={isListening ? 'Stop Recording' : 'Start Voice Dictation'}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span>Listening... (Tap to Stop)</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Dictate</span>
          </>
        )}
      </button>

      {transcript.length > 0 && (
        <button
          type="button"
          onClick={handleAIRestructure}
          disabled={isRestructuring}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-[#1DA851] hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
          title="Restructure spoken message into professional format with Gemini AI"
        >
          {isRestructuring ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
          )}
          <span>✨ Gemini AI Restructure</span>
        </button>
      )}
    </div>
  );
};
