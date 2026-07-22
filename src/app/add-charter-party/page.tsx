import AppLayout from "@/components/AppLayout";

export default function AddCharterPartyPage() {
  return (
    <AppLayout title="Add Charter Party">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          New Charter Party
        </h2>

        <p className="text-gray-600 mb-8">
          Enter the information below to add a new Charter Party to the STS database.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block font-semibold mb-2">
              Charter Party Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Contact Person
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Office Phone
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Cell Phone
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Street Address
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              City
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              State
            </label>

            <select className="w-full border rounded-lg p-3">
              <option>Select State</option>
              <option>California</option>
              <option>Nevada</option>
              <option>Arizona</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Notes
          </label>

          <textarea
            rows={5}
            className="w-full border rounded-lg p-3"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
            Cancel
          </button>

          <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold">
            Save Charter Party
          </button>

        </div>

      </div>
    </AppLayout>
  );
}