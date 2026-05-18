import { Outlet } from "react-router";
import { useState } from "react";
import { Toast } from "./ui/Toast";

export const App = () => {
  const [toast, setToast] = useState(null);

  const showToast = ({ type, heading, message }) => {
    setToast({
      id: Date.now(),
      type,
      heading,
      message,
    });
  };
  return (
    <div
      id="container"
      className="relative min-h-screen overflow-hidden bg-[#05010d] text-white"
    >
      {/* Background Glow Effects */}
      <div className="absolute -left-40 -top-40 h-120 w-120 rounded-full bg-purple-700/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-120 w-120 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <Outlet context={{ showToast }} />
      </div>
      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          heading={toast.heading}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

