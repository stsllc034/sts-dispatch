"use client";

import { useEffect, useState } from "react";
import type { CharterParty } from "@/types/charter-party";

interface CharterPartyFormProps {
  onSaved: () => void;
  editingParty?: CharterParty | null;
}


export default function CharterPartyForm({
  onSaved,
  editingParty,
}: CharterPartyFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);
useEffect(() => {
  if (editingParty) {
    setCompanyName(editingParty.companyName);
    setContactName(editingParty.contactName ?? "");
    setPhone(editingParty.phone ?? "");
    setEmail(editingParty.email ?? "");
    setBillingAddress(editingParty.billingAddress ?? "");
    setCity(editingParty.city ?? "");
    setState(editingParty.state ?? "");
    setZip(editingParty.zip ?? "");
    setPickupAddress(editingParty.pickupAddress ?? "");
    setNotes(editingParty.notes ?? "");
    setActive(editingParty.active);
  } else {
    setCompanyName("");
    setContactName("");
    setPhone("");
    setEmail("");
    setBillingAddress("");
    setCity("");
    setState("");
    setZip("");
    setPickupAddress("");
    setNotes("");
    setActive(true);
  }
}, [editingParty]);
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
          pickupAddress,
          notes,
          active,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save Charter Party.");
      }

      setCompanyName("");
      setContactName("");
      setPhone("");
      setEmail("");
      setBillingAddress("");
      setCity("");
      setState("");
      setZip("");
      setPickupAddress("");
      setNotes("");
      setActive(true);

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
      <h3 className="text-xl font-bold mb-6">
        Add Charter Party
      </h3>

      {/* Charter Party Information */}
      <h4 className="text-lg font-semibold border-b pb-2 mb-4">
        Charter Party Information
      </h4>

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
          />
        </div>

      </div>

      {/* Billing */}
      <h4 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
        Billing Address
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="md:col-span-2">
          <input
            type="text"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            placeholder="Billing Address"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="border border-gray-300 rounded-lg p-3"
        />

        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="border border-gray-300 rounded-lg p-3"
        />

        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="ZIP Code"
          className="border border-gray-300 rounded-lg p-3"
        />

      </div>

      {/* Pickup */}
      <h4 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
        Pickup Information
      </h4>

      <input
        type="text"
        value={pickupAddress}
        onChange={(e) => setPickupAddress(e.target.value)}
        placeholder="Default Pickup Address"
        className="w-full border border-gray-300 rounded-lg p-3"
      />

      {/* Notes */}
      <h4 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
        Additional Information
      </h4>

      <textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3"
        placeholder="Notes..."
      />

      {/* Status */}
      <h4 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
        Status
      </h4>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active Charter Party
      </label>

      <div className="flex justify-end mt-8">
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
  );
}