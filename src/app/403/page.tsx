export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h2>

        <p className="text-gray-600 mb-6">
          You don't have permission to view this page.
        </p>

        <a
          href="/"
          className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}