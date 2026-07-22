import type { CharterParty } from "@/types/charter-party";

interface CharterPartyTableProps {
  charterParties: CharterParty[];
  onEdit: (party: CharterParty) => void;
}

export default function CharterPartyTable({
  charterParties,
  onEdit,
}: CharterPartyTableProps) {
  if (charterParties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          Charter Party List
        </h2>

        <p className="text-gray-500">
          No charter parties have been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Charter Party List
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Status</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {charterParties.map((party) => (
              <tr
                key={party.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{party.companyName}</td>
                <td className="p-3">{party.contactName ?? "-"}</td>
                <td className="p-3">{party.phone ?? "-"}</td>
                <td className="p-3">{party.email ?? "-"}</td>

                <td className="p-3">
                  {party.active ? "🟢 Active" : "🔴 Inactive"}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => onEdit(party)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}