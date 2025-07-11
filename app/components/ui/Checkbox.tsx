// app/components/ui/Checkbox.tsx
import { Check } from 'lucide-react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ id, label, checked, onChange }: CheckboxProps) => (
  <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer group">
    <div className="relative flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer appearance-none h-5 w-5 rounded-md border-2 border-slate-600 group-hover:border-amber-500 checked:bg-amber-500 checked:border-amber-500 transition-colors"
      />
      <Check
        className={`absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none transition-opacity ${
          checked ? 'opacity-100' : 'opacity-0'
        }`}
        strokeWidth={3}
      />
    </div>
    <span className="text-slate-300 group-hover:text-white transition-colors">{label}</span>
  </label>
);