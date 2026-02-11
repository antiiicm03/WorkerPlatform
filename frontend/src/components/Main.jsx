import Button from "../components/Button";
import Lottie from "lottie-react";
import worker from "../assets/lottie/worker.json";

export default function Main() {
  return (
    <main className="flex-1">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
         
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Find Trusted Local Workers. Get the Job Done — Fast.
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Building trust between neighbors by making local services simple, transparent, and reliable.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button type="primary" btnText="Get Started" to="/browse-tasks" />
              <Button type="terciary" btnText="Learn More" to="/about" />
            </div>
          </div>

         
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full"></div>
              <Lottie animationData={worker} className="relative max-w-[400px] w-full" />
            </div>
          </div>
        </div>

        
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Verified Workers</h3>
            <p className="text-gray-300 leading-relaxed">
              All our professionals are thoroughly vetted and verified to ensure quality service.
            </p>
          </div>

         
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Fast Response</h3>
            <p className="text-gray-300 leading-relaxed">
              Get connected with local workers quickly and schedule jobs at your convenience.
            </p>
          </div>

          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Secure Payment</h3>
            <p className="text-gray-300 leading-relaxed">
              Safe and transparent transactions with our secure payment system.
            </p>
          </div>
        </div>

        
        <div className="mt-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/30 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Majstorija for their home service needs.
          </p>
          <Button type="primary" btnText="Sign Up Now" to='/register' />
        </div>
      </div>
    </main>
  );
}