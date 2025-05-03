export default function HomeScreen({ onStart }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <img src="/debugx-logo.png" alt="DebugX Logo" className="w-32 mb-6" />
      <h1 className="text-4xl font-thin mb-4">CCT Express</h1>
      <h2 className="text-xl font-light mb-6">Closing Cashier Tool</h2>
      <button
        onClick={onStart}
        className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg transition"
      >
        Start Closing
      </button>
      <footer className="text-center text-gray-500 text-sm mt-6">
        Powered by DebugX LLC ✨ | Build: v0.1.7
      </footer>
    </div>
  );
}
