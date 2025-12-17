export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs (Inherited from body, but adding local flair) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute top-4 left-4">
                    <a href="/" className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </a>
                </div>
                <div className="mb-8 text-center pt-4">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">SpecCraft</h1>
                    <p className="text-sm text-slate-500">Enter the future of requirements.</p>
                </div>
                {children}
            </div>
        </div>
    );
}
