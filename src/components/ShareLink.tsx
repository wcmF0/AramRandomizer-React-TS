interface ShareLinkProps {
  url: string;
  text: string;
  buttonText: string;
}

export const ShareLink = ({ url, text, buttonText }: ShareLinkProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      console.log('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600">
      <p className="mb-2 text-gray-300">{text}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300"
        />
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};