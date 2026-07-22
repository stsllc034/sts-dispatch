export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            STS Dispatch
          </h1>
          <p className="text-gray-600 mt-2">
            Stephens Transportation Services
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 text-white p-3 font-semibold hover:bg-blue-800"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          STS Dispatch System v1.0
        </p>
      </div>
    </main>
  );
}