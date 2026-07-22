"use client";

import { useState } from "react";

interface CharterPartyFormProps {
  onSaved: () => void;
}

export default function CharterPartyForm({
  onSaved,
}: CharterPartyFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!companyName.trim()) {
      alert("Company / School Name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/charter-parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          contactName,
          phone,
          email,
          billingAddress,
          city,
          state,
          zip,
          pickupAddress: "",
          notes: "",
          active: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save Charter Party.");
      }

      // Clear the form
      setCompanyName("");
      setContactName("");
      setPhone("");
      setEmail("");
      setBillingAddress("");
      setCity("");
      setState("");
      setZip("");

      // Tell the parent page to reload the table and close the form
      onSaved();

    } catch (error) {
      console.error(error);
      alert("There was a problem saving the Charter Party.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">
        Add Charter Party
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-semibold mb-1">
            Company / School Name
          </label>

          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Enter company or school name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Contact Name
          </label>

          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Enter contact name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="(555) 555-5555"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="name@example.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Billing Address
          </label>

          <input
            type="text"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Enter billing address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            City
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            State
          </label>

          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="State"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            ZIP Code
          </label>

          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="ZIP Code"
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save Charter Party"}
          </button>
        </div>

      </div>
    </div>
  );
}