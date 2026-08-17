import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      
      {/* Soft Pink & White Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-950/75 via-purple-950/65 to-slate-950/85 backdrop-blur-sm pointer-events-none" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(244,63,94,0.15)] border border-pink-100 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 shadow-lg shadow-pink-500/30 flex items-center justify-center mb-4 transform hover:rotate-6 hover:scale-105 transition duration-300">
            {/* House Logo SVG */}
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-pink-50 text-pink-600 font-semibold text-[11px] uppercase tracking-wider mb-2 border border-pink-200">
            Exclusive Management Suite
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            Airbnb Management Portal
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Select a module below to manage your properties, track expenses, and view performance.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Daily Tracker Card */}
          <Link
            href="/airbnb/daily"
            className="group relative bg-pink-50/40 hover:bg-pink-50/80 p-6 rounded-3xl border border-pink-100 hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-pink-500 text-white flex items-center justify-center mb-4 shadow-md shadow-pink-500/25 group-hover:scale-110 transition duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-pink-600 transition">
                Daily Tracker
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Record daily fees and booking revenue across all active houses.
              </p>
            </div>
            <div className="mt-5 text-pink-600 font-semibold text-xs flex items-center">
              Access Module <span className="ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </div>
          </Link>

          {/* Monthly Expenses Card */}
          <Link
            href="/airbnb/detailed-expenses"
            className="group relative bg-pink-50/40 hover:bg-pink-50/80 p-6 rounded-3xl border border-pink-100 hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-md shadow-rose-500/25 group-hover:scale-110 transition duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-rose-600 transition">
                Monthly Expenses
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage loyer, menage, reparation, wifi, utilities, and partner splits.
              </p>
            </div>
            <div className="mt-5 text-rose-600 font-semibold text-xs flex items-center">
              Access Module <span className="ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </div>
          </Link>

          {/* Summary Dashboard Card (Spans both columns) */}
          <Link
            href="/airbnb/summary"
            className="md:col-span-2 group relative bg-gradient-to-r from-pink-50/60 to-rose-50/60 hover:from-pink-100 hover:to-rose-100 p-6 rounded-3xl border border-pink-200 hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center mb-4 shadow-md shadow-pink-500/25 group-hover:scale-110 transition duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-pink-700 transition">
                Monthly Summary & Analytics
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                View aggregated net profits, occupancy rates, and regional performance stats.
              </p>
            </div>
            <div className="mt-5 text-pink-600 font-semibold text-xs flex items-center">
              Access Module <span className="ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}