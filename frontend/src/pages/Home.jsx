import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      
      <nav className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          CRYSTAL<span className="text-red-600">Bank</span>
        </h1>

        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-sm">
            Login
          </Link>

          <Link to="/register" className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700">
            Register
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center text-center px-6 py-24">
        
        <p 
        className="text-red-500 font-medium mb-4">
          SIMPLE. SECURE. DIGITAL BANKING.
        </p>

        <h2 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
          Manage your money with confidence.
        </h2>

        <p className="text-gray-400 max-w-xl mt-6 text-lg">
          Check your balance, make transfers, manage your account
          and keep track of your transactions from one place.
        </p>

        <div className="flex gap-4 mt-8">
          <Link to="/register" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium">
            Get Started
          </Link>

          <Link to="/login" className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg font-medium">
            Login
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Home;