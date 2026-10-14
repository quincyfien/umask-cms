"use client";

import { useState } from "react";

type Props = {
  programId: string;
  programTitle: string;
  badgeLabel?: string;
  applyOpen?: boolean;
  closed?: boolean;
  cta?: string;
};

const APPLICANT_TYPES = ["STUDENT", "RESEARCHER", "PROFESSIONAL", "OTHER"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function ProgramApply({
  programId,
  programTitle,
  cta = "Apply Now",
}: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [doneReference, setDoneReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [position, setPosition] = useState("");
  const [applicantType, setApplicantType] = useState("STUDENT");
  const [motivation, setMotivation] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    for (const f of selected) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        setError(`"${f.name}" exceeds the 5MB file limit. Please select a smaller file.`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function validateStep1(): boolean {
    setError(null);
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please provide your full legal or professional name.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    setError(null);
    if (!motivation.trim() || motivation.trim().length < 50) {
      setError("Statement of motivation must be at least 50 characters long.");
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!consentGiven) {
      setError("You must acknowledge and consent to the privacy policy to submit.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim());
    if (phone.trim()) formData.append("phone", phone.trim());
    if (institution.trim()) formData.append("institution", institution.trim());
    if (position.trim()) formData.append("position", position.trim());
    formData.append("applicantType", applicantType);
    formData.append("motivation", motivation.trim());
    formData.append("consentGiven", "true");
    formData.append("idempotencyKey", crypto.randomUUID());
    if (honeypot) formData.append("website", honeypot);

    for (const file of files) {
      formData.append("documents", file);
    }

    try {
      const res = await fetch("/api/public/applications", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Application submission failed. Please verify your details.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      setDoneReference(data.reference ?? "SUBMITTED");
      setSubmitting(false);
    } catch {
      setError("A network error occurred. Please check your connection and retry.");
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-content focus:border-brand focus:outline-none transition-colors";

  return (
    <>
      {/* Floating Apply CTA */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setDoneReference(null);
          setError(null);
          setStep(1);
        }}
        className="fixed bottom-8 right-8 z-50 rounded-full bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-xl shadow-brand/40 transition-all hover:bg-brand-hover hover:scale-105 active:scale-95"
      >
        {cta}
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-edge bg-card p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand">Application Portal</span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-content">{programTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-content transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {doneReference ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/20 text-3xl text-brand">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-content">Application Successfully Received</h3>
                <p className="mt-2 text-sm text-muted">
                  Your submission has been cataloged for scientific evaluation. Please retain your reference identifier:
                </p>
                <div className="my-6 inline-block rounded-xl border border-brand/40 bg-brand/10 px-6 py-3 font-mono text-lg font-bold tracking-wider text-brand">
                  {doneReference}
                </div>
                <p className="text-xs text-muted">
                  A verification confirmation has been sent to <span className="text-content font-medium">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-8 rounded-full bg-brand px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div>
                {/* Step Progress Indicators */}
                <div className="mb-8 grid grid-cols-3 gap-2 border-b border-edge pb-4 font-mono text-[11px]">
                  <div
                    className={`flex items-center gap-2 ${
                      step === 1 ? "font-bold text-brand" : step > 1 ? "text-content" : "text-muted"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                      1
                    </span>
                    <span>Profile</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      step === 2 ? "font-bold text-brand" : step > 2 ? "text-content" : "text-muted"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                      2
                    </span>
                    <span>Statement</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      step === 3 ? "font-bold text-brand" : "text-muted"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                      3
                    </span>
                    <span>Review</span>
                  </div>
                </div>

                {/* Hidden Honeypot */}
                <div className="hidden">
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Step 1: Personal & Institutional Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                          Full Legal Name <span className="text-brand">*</span>
                        </label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Dr. Samuel Adeyemi"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                          Email Address <span className="text-brand">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="adeyemi@university.edu"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+234 ..."
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                          Applicant Classification <span className="text-brand">*</span>
                        </label>
                        <select
                          value={applicantType}
                          onChange={(e) => setApplicantType(e.target.value)}
                          className={inputCls}
                        >
                          {APPLICANT_TYPES.map((t) => (
                            <option key={t} value={t} className="bg-card text-content">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                          Institutional Affiliation
                        </label>
                        <input
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="e.g. University of Lagos"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                          Current Position / Discipline
                        </label>
                        <input
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder="e.g. Senior Researcher in Genomics"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Motivation & Documents */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-mono text-xs uppercase tracking-wider text-muted">
                          Statement of Motivation <span className="text-brand">*</span>
                        </label>
                        <span className="font-mono text-[10px] text-muted">
                          {motivation.length}/3000 chars (min 50)
                        </span>
                      </div>
                      <textarea
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                        rows={5}
                        placeholder="Detail your scientific focus, why you are applying to this program, and how it aligns with your research goals..."
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                        Supporting Documents (Max 5MB each)
                      </label>
                      <p className="mb-2 text-xs text-muted font-light">
                        Upload your CV, research proposal, or academic transcripts (PDF, DOCX, ZIP).
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={handleFileChange}
                        className="block w-full text-xs text-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/30 cursor-pointer"
                      />

                      {files.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Attached Files:</p>
                          <ul className="divide-y divide-edge rounded-xl border border-edge bg-surface/50 p-2">
                            {files.map((f, i) => (
                              <li key={i} className="flex items-center justify-between py-1.5 px-2 text-xs">
                                <span className="font-mono truncate max-w-[280px] text-content">{f.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-[10px] text-muted">
                                    {(f.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="text-red-400 hover:text-red-300 font-mono"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-edge bg-surface p-4 text-xs space-y-2">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider text-brand mb-2">
                        Review Summary
                      </h4>
                      <p>
                        <span className="text-muted">Applicant:</span>{" "}
                        <span className="font-semibold text-content">{fullName}</span> ({applicantType})
                      </p>
                      <p>
                        <span className="text-muted">Email:</span>{" "}
                        <span className="font-semibold text-content">{email}</span>
                      </p>
                      {phone && (
                        <p>
                          <span className="text-muted">Phone:</span>{" "}
                          <span className="text-content">{phone}</span>
                        </p>
                      )}
                      {(institution || position) && (
                        <p>
                          <span className="text-muted">Affiliation:</span>{" "}
                          <span className="text-content">
                            {[position, institution].filter(Boolean).join(" at ")}
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="text-muted">Documents:</span>{" "}
                        <span className="font-mono text-content">
                          {files.length === 0 ? "None attached" : `${files.length} file(s) attached`}
                        </span>
                      </p>
                    </div>

                    <label className="flex items-start gap-2.5 pt-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-0.5 accent-brand"
                      />
                      <span>
                        I certify that the information provided is accurate and consent to UNMASK processing my
                        credentials according to the{" "}
                        <a href="/privacy" target="_blank" className="text-brand underline hover:opacity-80">
                          Privacy Policy
                        </a>.
                      </span>
                    </label>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between gap-3 border-t border-edge pt-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setStep((prev) => (prev - 1) as 1 | 2);
                      }}
                      className="rounded-full border border-edge px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:border-muted hover:text-content transition-colors"
                    >
                      ← Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-edge px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:border-muted hover:text-content transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="rounded-full bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
                    >
                      Continue →
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) setStep(3);
                      }}
                      className="rounded-full bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
                    >
                      Review →
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="rounded-full bg-brand px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand/20"
                    >
                      {submitting ? "Submitting Application…" : "Submit Application"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
