import { useState } from "react";
import { Plus, Save, Download, Eye, Sparkles, X } from "lucide-react";

interface FloatingActionButtonProps {
  onSave?: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
  onAiEnhance?: () => void;
}

export default function FloatingActionButton({ 
  onSave, 
  onPreview, 
  onDownload, 
  onAiEnhance 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Save, label: "Save Resume", onClick: onSave, color: "text-blue-400" },
    { icon: Eye, label: "Preview", onClick: onPreview, color: "text-green-400" },
    { icon: Download, label: "Download PDF", onClick: onDownload, color: "text-purple-400" },
    { icon: Sparkles, label: "AI Enhance", onClick: onAiEnhance, color: "text-gold-primary" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col space-y-2 mb-4">
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick?.();
                setIsOpen(false);
              }}
              className={`
                flex items-center space-x-2 px-4 py-2 bg-card-dark border border-gold-primary/20 
                rounded-full shadow-lg backdrop-blur-sm hover:bg-gold-primary/10 transition-all 
                duration-300 transform translate-x-12 opacity-0 animate-slide-up
                ${action.color}
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-gold-primary text-deep-black shadow-lg 
          hover:scale-110 transition-all duration-300 flex items-center justify-center
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
}