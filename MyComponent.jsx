export default function MyComponent(props) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        🚀 Repository Connection Test
      </h2>
      <p className="text-gray-600">
        This component was updated to trigger a push to the newly created
        Builder-zen-hub repository!
      </p>
      <button
        onClick={() => alert("Repository push test successful!")}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Push Success
      </button>
    </div>
  );
}
