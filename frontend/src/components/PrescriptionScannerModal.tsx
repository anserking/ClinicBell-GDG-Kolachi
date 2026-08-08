import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import { getApiBaseUrl } from '../config';
import { MedicineItem } from './PrescriptionForm';

interface PrescriptionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: {
    diagnosis?: string;
    prescription?: string;
    medicines?: MedicineItem[];
  }) => void;
}

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setErrorMsg(null);

    const apiBase = getApiBaseUrl();
    try {
      const res = await fetch(`${apiBase}/api/gemini/scan-prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage })
      });

      if (!res.ok) {
        throw new Error('Failed to process image');
      }

      const data = await res.json();
      onScanComplete({
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        medicines: data.medicines
      });
      onClose();
    } catch (err: any) {
      console.warn('Prescription OCR scan error:', err);
      setErrorMsg('Unable to decipher handwritten note automatically. You can edit fields manually.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-gradient-to-br from-[#25D366] to-[#0F5C56] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#142420]">Decipher Doctor Handwriting</h2>
          <p className="text-xs text-[#7C8F87]">
            Upload or take a photo of a handwritten doctor prescription slip. Gemini Vision AI deciphers medical handwriting in seconds.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Image Preview / Drop Area */}
        {selectedImage ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#0F5C56] max-h-64 flex items-center justify-center bg-black">
            <img src={selectedImage} alt="Prescription Slip" className="max-h-64 object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-[#DCE6E2] hover:border-[#0F5C56] p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all bg-[#F4F7F6]/60 cursor-pointer"
            >
              <Upload className="w-8 h-8 text-[#0F5C56]" />
              <div className="text-xs font-bold text-[#142420]">Upload Image / Take Photo</div>
              <div className="text-[11px] text-[#7C8F87]">Supports JPEG, PNG, WEBP</div>
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE6E2]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#4E6259] hover:bg-[#F4F7F6] rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleProcessScan}
            disabled={!selectedImage || isScanning}
            className="flex items-center gap-2 bg-[#0F5C56] hover:bg-[#0A413D] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini Deciphering Handwriting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#25D366]" />
                <span>Decipher Prescription</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
