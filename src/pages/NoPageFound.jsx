import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NoPageFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-primary animate-bounce">404</h1>
        
        <div className="absolute -rotate-12 transform">
          <div className="bg-red-500 text-white px-4 py-1 text-sm rounded-lg shadow-lg">
            Page Not Found
          </div>
        </div>

        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Oops! Looks like you're lost
          </h3>
          
          <p className="text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 gap-2 shadow-lg hover:shadow-xl"
          >
            <FiArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoPageFound;
