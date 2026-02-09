import Header from "../components/Header";
import Main from "../components/Main";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />
      <Main />

      {/* futer */}
      <footer className="bg-gray-900/80 border-t border-gray-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2026 Majstorija. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}