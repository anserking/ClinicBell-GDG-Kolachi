import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pill, Check, Sparkles } from 'lucide-react';

export interface MedicineItem {
  id: string;
  name: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormProps {
  onPrescriptionChange: (formattedText: string, items: MedicineItem[]) => void;
  initialItems?: MedicineItem[];
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  onPrescriptionChange,
  initialItems
}) => {
  const [items, setItems] = useState<MedicineItem[]>(
    initialItems && initialItems.length > 0
      ? initialItems
      : [
          {
            id: 'm-1',
            name: 'Tab Paracetamol 500mg',
            frequency: '1-1-1',
            duration: '3 days',
            instructions: 'After meals'
          }
        ]
  );

  // Compile formatted prescription text whenever items change
  useEffect(() => {
    const formattedLines = items
      .filter((m) => m.name.trim().length > 0)
      .map((m, i) => `${i + 1}. ${m.name.trim()} — (${m.frequency}) ${m.instructions} x ${m.duration}`);

    onPrescriptionChange(formattedLines.join('\n'), items);
  }, [items, onPrescriptionChange]);

  const addRow = () => {
    setItems([
      ...items,
      {
        id: `m-${Date.now().toString().slice(-4)}`,
        name: '',
        frequency: '1-0-1',
        duration: '5 days',
        instructions: 'After meals'
      }
    ]);
  };

  const removeRow = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((m) => m.id !== id));
  };

  const updateRow = (id: string, field: keyof MedicineItem, value: string) => {
    setItems(items.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <div className="space-y-4 bg-white border border-[#DCE6E2] rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-[#DCE6E2] pb-3">
        <h3 className="text-sm font-bold text-[#142420] flex items-center gap-2">
          <Pill className="w-4 h-4 text-[#0F5C56]" />
          <span>Structured Prescription Builder</span>
        </h3>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 text-xs font-semibold text-[#0F5C56] hover:text-[#0A413D] bg-[#0F5C56]/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Medication Entry Rows */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#F4F7F6]/70 border border-[#DCE6E2] p-3 rounded-xl space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
          >
            <span className="text-xs font-bold text-[#7C8F87] w-5 text-center shrink-0 hidden sm:inline">
              {index + 1}.
            </span>

            {/* Medicine Name */}
            <div className="flex-1">
              <label className="block sm:hidden text-[10px] font-bold text-[#7C8F87] mb-0.5">
                Medicine Name &amp; Strength
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateRow(item.id, 'name', e.target.value)}
                placeholder="e.g. Tab Panadol 500mg, Syr Hydryllin"
                className="w-full px-3 py-1.5 bg-white border border-[#DCE6E2] rounded-lg text-xs font-medium text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>

            {/* Dose Frequency */}
            <div className="w-full sm:w-32">
              <label className="block sm:hidden text-[10px] font-bold text-[#7C8F87] mb-0.5">
                Daily Dose Frequency
              </label>
              <select
                value={item.frequency}
                onChange={(e) => updateRow(item.id, 'frequency', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-[#DCE6E2] rounded-lg text-xs text-[#142420] font-mono-tabular focus:outline-none focus:border-[#0F5C56]"
              >
                <option value="1-0-1">1-0-1 (Morn &amp; Night)</option>
                <option value="1-1-1">1-1-1 (Thrice Daily)</option>
                <option value="1-0-0">1-0-0 (Morning Only)</option>
                <option value="0-0-1">0-0-1 (Bedtime Only)</option>
                <option value="1-1-1-1">1-1-1-1 (Every 6 hrs)</option>
                <option value="PRN">PRN (As Needed)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="w-full sm:w-28">
              <label className="block sm:hidden text-[10px] font-bold text-[#7C8F87] mb-0.5">
                Duration
              </label>
              <select
                value={item.duration}
                onChange={(e) => updateRow(item.id, 'duration', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-[#DCE6E2] rounded-lg text-xs text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              >
                <option value="3 days">3 days</option>
                <option value="5 days">5 days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
              </select>
            </div>

            {/* Care Instructions */}
            <div className="w-full sm:w-32">
              <label className="block sm:hidden text-[10px] font-bold text-[#7C8F87] mb-0.5">
                Instructions
              </label>
              <select
                value={item.instructions}
                onChange={(e) => updateRow(item.id, 'instructions', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-[#DCE6E2] rounded-lg text-xs text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              >
                <option value="After meals">After meals</option>
                <option value="Before meals">Before meals</option>
                <option value="At bedtime">At bedtime</option>
                <option value="With warm water">With warm water</option>
                <option value="Empty stomach">Empty stomach</option>
              </select>
            </div>

            {/* Remove Row Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(item.id)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                title="Remove Medication"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Live Formatted Medical Order Preview */}
      <div className="bg-[#0A413D] text-[#EAF3F1] p-3.5 rounded-xl text-xs space-y-1.5 font-mono-tabular">
        <span className="text-[10px] text-[#9FC0BA] uppercase tracking-wider font-bold block">
          Standard Medical Prescription Order Preview
        </span>
        <div className="whitespace-pre-line leading-relaxed text-white">
          {items.map((m, i) => `${i + 1}. ${m.name || '...'} — (${m.frequency}) ${m.instructions} x ${m.duration}`).join('\n')}
        </div>
      </div>
    </div>
  );
};
