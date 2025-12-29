function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="glass-panel p-10 rounded-2xl text-center max-w-md mx-auto animate-[fade-in_1s_ease-out]">
        <h1 className="text-4xl font-serif font-bold text-white mb-4">
          Anchor of Hope
        </h1>
        <p className="text-slate-300 mb-6">
          System Initialized. Ready for Assessment Build.
        </p>
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 cursor-pointer">
          Start Project
        </button>
      </div>
    </div>
  )
}

export default App