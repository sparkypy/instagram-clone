import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export const Toast = ({
  type = "success",
  heading = "Success",
  message = "Operation completed successfully.",
  duration = 4000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setVisible(true);
    }, 50);

    const exitTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const styles = {
    success: {
      icon: (
        <CheckCircle2
          className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]"
          size={22}
        />
      ),

      glow: "shadow-emerald-500/10",

      progress:
        "from-emerald-400 to-green-500",
    },

    error: {
      icon: (
        <AlertCircle
          className="text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.7)]"
          size={22}
        />
      ),

      glow: "shadow-rose-500/10",

      progress:
        "from-rose-400 to-red-500",
    },
  };

  const current = styles[type];

  return (
    <div
      className={`
        fixed top-5 right-5 z-50
        w-75
        sm:w-90
        overflow-hidden
        rounded-3xl

        border border-white/10
        bg-white/10
        backdrop-blur-2xl

        shadow-2xl ${current.glow}

        transition-all duration-300

        ${
          visible && !closing
            ? "translate-x-0 opacity-100"
            : "translate-x-[120%] opacity-0"
        }
      `}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/5 pointer-events-none" />

      {/* Progress Bar */}
      <div className="h-1 w-full bg-white/5">
        <div
          className={`
            h-full
            animate-progress
            bg-linear-to-r
            ${current.progress}
          `}
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="mt-0.5">
          {current.icon}
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">
            {heading}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-zinc-300">
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="
            rounded-lg
            p-1.5
            text-zinc-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};