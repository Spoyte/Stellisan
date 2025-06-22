export default function WorkingPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ✅ Next.js is Working!
        </h1>
        <p className="text-gray-600 mb-4">
          This page loads successfully without any complex dependencies.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Tailwind CSS is working</p>
          <p>• React components are rendering</p>
          <p>• Next.js routing is functional</p>
        </div>
        <div className="mt-6">
          <a 
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
} 