import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-paper px-4 py-12">
      <div className="w-full max-w-md aristocratic-card rounded-2xl p-8 sm:p-10 border border-brand/30 shadow-2xl">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="UNMASK Logo" className="mx-auto h-16 w-16 object-contain mb-4" />
          <span className="text-[10px] font-mono tracking-super-wide uppercase text-brand font-semibold block">
            UNMASK CMS CONTROL PANEL
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Staff Authentication</h1>
          <p className="text-xs text-gray-400 mt-2">
            Enter your credentials to manage publications, research projects, and organization settings.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 border-t border-white/10 pt-4 text-center">
          <p className="text-[11px] font-mono text-gray-500">
            Protected Area · Access monitored under SRS v5 Security Audit
          </p>
        </div>
      </div>
    </div>
  );
}
