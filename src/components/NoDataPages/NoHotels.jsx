export default function NoHotels() {
    return (
      <div className="flex flex-col w-full items-center justify-center min-h-[500px] p-6 mt-12">
        <div className="relative">
          {/* Illustration */}
          <div className="w-32 h-32 bg-gray-300 rounded-full animate-bounce"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9 6 9-6-9-6-9 6z"></path>
              <path d="M3 9v6a9 9 0 0018 0V9"></path>
            </svg>
          </div>
        </div>
  
        <h2 className="mt-6 text-xl font-semibold text-gray-700">
          No Pet Shops Available
        </h2>
        <p className="mt-2 text-gray-500">
          Try adjusting your search filters or check back later.
        </p>
  
      </div>
    );
  }
  