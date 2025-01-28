"use client";

export default function BackButton() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="d-flex justify-content-end">
    <button
      onClick={handleBack}
      className="shadow-sm btn btn-secondary me-3"
    >
      Back
    </button>
    </div>
  );
}
