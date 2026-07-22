"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import CharterPartyTable from "@/components/charter-parties/CharterPartyTable";
import CharterPartyForm from "@/components/charter-parties/CharterPartyForm";
import type { CharterParty } from "@/types/charter-party";

export default function CharterPartiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [charterParties, setCharterParties] = useState<CharterParty[]>([]);
  const [editingParty, setEditingParty] = useState<CharterParty | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCharterParties() {
    try {
      const response = await fetch("/api/charter-parties");
      const data = await response.json();
      setCharterParties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCharterParties();
  }, []);

  function handleSaved() {
    loadCharterParties();
    setEditingParty(null);
    setShowForm(false);
  }

  function handleEdit(party: CharterParty) {
    setEditingParty(party);
    setShowForm(true);
  }

  function handleAddNew() {
    setEditingParty(null);
    setShowForm(true);
  }

  return (
    <AppLayout title="Charter Parties">
      <div className="bg-white rounded-lg shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Charter Party Database
            </h2>

            <p className="text-gray-600">
              Manage schools, organizations, churches, businesses and other
              charter clients.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingParty(null);
              } else {
                handleAddNew();
              }
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold"
          >
            {showForm ? "Close" : "+ Add Charter Party"}
          </button>
        </div>

        {showForm && (
          <CharterPartyForm
            onSaved={handleSaved}
            editingParty={editingParty}
          />
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Charter Party, Contact, or City..."
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <CharterPartyTable
            charterParties={charterParties}
            onEdit={handleEdit}
          />
        )}

      </div>
    </AppLayout>
  );
}