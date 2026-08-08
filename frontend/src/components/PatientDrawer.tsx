import React, { useState, useEffect, useRef } from 'react';
import { Patient, VisitRecord } from '../types';
import { SkeletonCard } from './ui/SkeletonCard';
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  Send,
  Calendar,
  Check,
  Clock,
  MessageSquare,
  FileText,
  AlertCircle,
  Phone,
  Volume2
} from 'lucide-react';

interface PatientDrawerProps {
  patient: Patient | null;
  onClose: () => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onSendWhatsApp: (patient: Patient, customMsg: string) => void;
}

export const PatientDrawer: React.FC<PatientDrawerProps> = ({
  patient,
  onClose,
  onUpdatePatient,
  onSendWhatsApp
}) => {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [typedText, setTypedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Parsed AI fields
  const [parsedDiagnosis, setParsedDiagnosis] = useState('');
  const [parsedPrescription, setParsedPrescription] = useState('');

  // Follow-up settings
  const [followupEnabled, setFollowupEnabled] = useState(patient?.followupEnabled ?? true);
  const [followupDelay, setFollowupDelay] = useState(patient?.followupDelay || '2 weeks');
  const [whatsappMsg, setWhatsappMsg] = useState(
    patient?.followupMessage ||
    `Assalam-o-Alaikum ${patient?.name || 'Patient'}, this is Al-Noor Clinic following up on your visit today with Dr. Ahmed Raza. How are you feeling now? Please let us know if you need any assistance.`
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const [speechError, setSpeechError] = useState<string | null>(null);

  // Synchronize when patient changes
  useEffect(() => {
    if (!patient) return;
    setFollowupEnabled(patient.followupEnabled ?? true);
    setFollowupDelay(patient.followupDelay || '2 weeks');
    setWhatsappMsg(
      patient.followupMessage ||
      `Assalam-o-Alaikum ${patient.name}, this is Al-Noor Clinic following up on your visit today with Dr. Ahmed Raza. How are you feeling now? Please let us know if you need any assistance.`
    );
    setTypedText('');
    setAudioTranscript('');
    setParsedDiagnosis('');
    setParsedPrescription('');
    setSavedSuccess(false);
    setSpeechError(null);
  }, [patient?.id]);

  // Handle Speech Recognition cleanly across desktop & mobile
  const startRecording = () => {
    setSpeechError(null);
    setIsRecording(true);
    setRecordingTime(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        recognition.continuous = !isIOS;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript;
          }
          if (fullTranscript.trim()) {
            setAudioTranscript(fullTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[SpeechRecognition] error event:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setSpeechError('Microphone access blocked. Use mobile keyboard mic 🎙️ or enable mic in browser settings.');
          } else if (event.error !== 'no-speech') {
            setSpeechError(`Voice dictation note: ${event.error}`);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (err) {
        console.warn('[SpeechRecognition] Exception on start:', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
  };

  // AI Structure Note with Gemini API endpoint
  const handleAiStructure = async () => {
    const rawNote = inputMode === 'voice' ? audioTranscript : typedText;
    if (!rawNote.trim()) return;

    setIsAiProcessing(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBase}/api/gemini/parse-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: rawNote,
          patientName: patient.name,
          previousDiagnosis: patient.history[0]?.text || ''
        })
      });

      const data = await response.json();
      if (data.diagnosis) setParsedDiagnosis(data.diagnosis);
      if (data.prescription) setParsedPrescription(data.prescription);
      if (data.whatsappMessage) setWhatsappMsg(data.whatsappMessage);
    } catch (err) {
      console.error('AI parse error:', err);
      setParsedDiagnosis('Diagnosis & Examination');
      setParsedPrescription(rawNote);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Save new visit record to patient history
  const handleSavePrescription = () => {
    const noteText = inputMode === 'voice' ? audioTranscript : typedText;
    const finalDiagnosis = parsedDiagnosis || 'Clinical Visit';
    const finalPrescription = parsedPrescription || noteText || 'Prescription issued';

    if (!noteText.trim() && !parsedPrescription.trim()) return;

    const newVisit: VisitRecord = {
      id: `v-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      text: `${finalDiagnosis}: ${finalPrescription}`,
      diagnosis: finalDiagnosis,
      prescription: finalPrescription,
      doctorName: 'Dr. Ahmed Raza'
    };

    const updatedPatient: Patient = {
      ...patient,
      status: followupEnabled ? 'due' : 'completed',
      visitsCount: patient.visitsCount + 1,
      lastVisit: 'Today',
      note: `${finalDiagnosis} — ${finalPrescription}`,
      history: [newVisit, ...patient.history],
      followupEnabled,
      followupDelay,
      followupMessage: whatsappMsg
    };

    onUpdatePatient(updatedPatient);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-[#0A1412]/40 backdrop-blur-xs flex justify-end z-50 animate-fadeIn">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
        {/* Drawer Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-[#DCE6E2] flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif-display text-xl font-bold text-[#142420]">
              {patient.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#7C8F87] font-mono-tabular mt-1">
              <span className="flex items-center gap-1 text-[#0F5C56]">
                <Phone className="w-3.5 h-3.5" />
                {patient.phone}
              </span>
              <span>·</span>
              <span>{patient.visitsCount} visits</span>
              <span>·</span>
              <span>Last visit: {patient.lastVisit}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7C8F87] hover:text-[#142420] hover:bg-[#F4F7F6] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Medical History Timeline */}
          <div className="border border-[#DCE6E2] rounded-2xl p-5 bg-white shadow-2xs">
            <h3 className="text-sm font-semibold text-[#142420] flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#0F5C56]" />
              <span>Medical History & Past Visits</span>
            </h3>

            <div className="space-y-4 pl-1">
              {patient.history.map((h, i) => (
                <div key={h.id || i} className="flex items-start gap-3 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0F5C56] mt-1.5 shrink-0 ring-4 ring-[#E5F0EE]" />
                  <div className="flex-1">
                    <div className="text-[11px] font-mono-tabular text-[#7C8F87]">
                      {h.date} {h.doctorName ? `· ${h.doctorName}` : ''}
                    </div>
                    <div className="text-xs sm:text-sm text-[#142420] font-medium mt-0.5 leading-relaxed">
                      {h.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Diagnosis & Prescription Input */}
          <div className="border border-[#DCE6E2] rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#142420] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F5C56]" />
                <span>New Diagnosis & Prescription</span>
              </h3>

              {/* Mode Toggle */}
              <div className="flex bg-[#F4F7F6] p-1 rounded-xl border border-[#DCE6E2] text-xs">
                <button
                  onClick={() => setInputMode('voice')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${inputMode === 'voice'
                    ? 'bg-white text-[#0A413D] shadow-xs'
                    : 'text-[#4E6259] hover:text-[#142420]'
                    }`}
                >
                  Voice Dictation
                </button>
                <button
                  onClick={() => setInputMode('text')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${inputMode === 'text'
                    ? 'bg-white text-[#0A413D] shadow-xs'
                    : 'text-[#4E6259] hover:text-[#142420]'
                    }`}
                >
                  Type Note
                </button>
              </div>
            </div>

            {/* Input Panels */}
            {inputMode === 'voice' ? (
              <div className="border border-[#DCE6E2] rounded-xl p-4 bg-[#F4F7F6]/50 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-95 ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-[#0F5C56] hover:bg-[#0A413D]'
                      }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <div className="flex-1">
                    <div className="text-xs font-semibold text-[#142420] flex items-center gap-2">
                      <span>{isRecording ? 'Recording in progress...' : 'Click mic to dictate'}</span>
                      {isRecording && (
                        <span className="font-mono-tabular text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-[11px]">
                          {formatTime(recordingTime)}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#7C8F87]">
                      Speak naturally in English or Urdu. Gemini will auto-format diagnosis & rx.
                    </div>
                  </div>
                </div>

                {speechError && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                    {speechError}
                  </div>
                )}

                {/* Simulated Audio Waveform Visualizer */}
                {isRecording && (
                  <div className="flex items-center gap-1 h-6 py-1">
                    {Array.from({ length: 32 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="flex-1 bg-[#0F5C56] rounded-full transition-all duration-150"
                        style={{
                          height: `${Math.max(4, Math.sin(idx + recordingTime * 3) * 18 + 10)}px`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Live Transcript Display */}
                <textarea
                  value={audioTranscript}
                  onChange={(e) => setAudioTranscript(e.target.value)}
                  placeholder="Dictated notes will appear here in real-time..."
                  className="w-full h-24 p-3 bg-white border border-[#DCE6E2] rounded-lg text-xs sm:text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                />

                <div className="flex items-center justify-between text-[11px] text-[#7C8F87]">
                  <span>Or tap keyboard mic 🎙️ to dictate</span>
                  <button
                    onClick={() =>
                      setAudioTranscript(
                        'Patient presents with mild throat infection and fever 101°F. Prescribe Augmentin 625mg twice daily for 5 days and Panadol Extra.'
                      )
                    }
                    className="text-[#0F5C56] font-semibold hover:underline cursor-pointer"
                  >
                    + Fill Sample Dictation
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="e.g. Patient has mild throat infection and fever 101°F. Prescribed Augmentin 625mg b.i.d for 5 days and Panadol Extra."
                className="w-full h-28 p-3 bg-white border border-[#DCE6E2] rounded-xl text-xs sm:text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            )}

            {/* AI Auto-Format Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                onClick={handleAiStructure}
                disabled={isAiProcessing || (!audioTranscript.trim() && !typedText.trim())}
                className="flex items-center gap-1.5 bg-[#E5F0EE] hover:bg-[#0F5C56] text-[#0A413D] hover:text-white font-semibold text-xs py-2 px-3 rounded-lg transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0F5C56] group-hover:text-white" />
                <span>{isAiProcessing ? 'AI Formatting...' : 'Gemini Auto-Structure Rx'}</span>
              </button>

              <div className="flex items-center gap-2">
                {savedSuccess && (
                  <span className="text-xs text-[#1DA851] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to Record
                  </span>
                )}
                <button
                  onClick={handleSavePrescription}
                  className="bg-[#0F5C56] hover:bg-[#0A413D] text-white font-semibold text-xs sm:text-sm py-2 px-4 rounded-xl transition-all shadow-xs active:scale-95"
                >
                  Save to Patient Record
                </button>
              </div>
            </div>

            {/* AI Loading Skeleton Loader */}
            {isAiProcessing && (
              <div className="py-1">
                <SkeletonCard />
              </div>
            )}

            {/* Render Parsed AI Outputs if available */}
            {(parsedDiagnosis || parsedPrescription) && (
              <div className="p-3 bg-[#E5F0EE]/60 border border-[#B1D8D2] rounded-xl text-xs space-y-1.5 animate-fadeIn">
                <div className="font-semibold text-[#0A413D] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Structured Prescription Output:
                </div>
                <div><strong>Diagnosis:</strong> {parsedDiagnosis}</div>
                <div><strong>Regimen:</strong> {parsedPrescription}</div>
              </div>
            )}
          </div>

          {/* WhatsApp Automated Follow-up Card */}
          <div className="border border-[#C7EDD5] rounded-2xl p-5 bg-[#E9FAF0] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F5C34]">
                    Automated WhatsApp Follow-up
                  </h3>
                  <div className="text-[11px] text-[#1DA851]">
                    Check in with patient after treatment
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setFollowupEnabled(!followupEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${followupEnabled ? 'bg-[#25D366]' : 'bg-[#DCE6E2]'
                  }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform shadow-xs ${followupEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {followupEnabled && (
              <div className="space-y-3 pt-1 border-t border-[#C7EDD5]">
                <div className="flex items-center justify-between text-xs text-[#0F5C34]">
                  <span className="font-semibold">Schedule Delay:</span>
                  <select
                    value={followupDelay}
                    onChange={(e) => setFollowupDelay(e.target.value)}
                    className="bg-white border border-[#C7EDD5] rounded-lg px-2.5 py-1 text-xs font-medium text-[#0F5C34] focus:outline-none"
                  >
                    <option value="3 days">3 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="3 weeks">3 weeks</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#0F5C34]">
                    WhatsApp Message Preview:
                  </label>
                  <textarea
                    value={whatsappMsg}
                    onChange={(e) => setWhatsappMsg(e.target.value)}
                    className="w-full h-20 p-2.5 bg-white border border-[#C7EDD5] rounded-xl text-xs text-[#142420] focus:outline-none focus:border-[#25D366]"
                  />
                </div>

                <button
                  onClick={() => onSendWhatsApp(patient, whatsappMsg)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-[#06331A] font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Follow-up Message via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
