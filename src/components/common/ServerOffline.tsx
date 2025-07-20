import { FaServer } from "react-icons/fa";
import { useNavigate } from "react-router";

const ServerOffline = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark text-white px-4">
      <div className="text-center">
        <FaServer className="text-6xl text-primary mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold mb-2">Server is Offline</h1>
        <p className="text-lg text-gray-400 mb-6">
          We're having trouble connecting to the server. Please try again later.
        </p>
        <button
          onClick={() => navigate(0)}
          className="bg-primary/90 hover:bg-primary text-white px-6 py-2 rounded transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ServerOffline;
