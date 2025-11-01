import { FaExclamationTriangle } from 'react-icons/fa'

const DeviceNotSupported = () => {
    const githubRepoLink = "https://github.com/your-github-handle"; // Replace with your actual GitHub repo link

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark text-white px-4">
            <div className="text-center">
                <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2">Device Not Supported</h1>
                <p className="text-lg text-gray-400 mb-6">
                    It looks like your Device is not supported. For a better experience, download our mobile client.
                    <br />
                    Our mobile client is currently under development, but you can always check our GitHub for the latest updates and builds once it’s ready.
                </p>
                <a
                    href={githubRepoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/90 hover:bg-primary text-white px-6 py-2 rounded mb-6 inline-block transition"
                >
                    Check for Latest Mobile Build
                </a>
            </div>
        </div>
    );
};

export default DeviceNotSupported;
