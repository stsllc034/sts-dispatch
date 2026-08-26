"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import DriverTable from "@/components/drivers/DriverTable";

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  licenseNo: string | null;
  active: boolean;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [password, setPassword] = useState("");
  const [editingDriverId, setEditingDriverId] = useState<number | null>(null);

  async function loadDrivers() {
  const response = await fetch("/api/drivers", {
    cache: "no-store",
  });
  const data = await response.json();
  setDrivers(data);
}

  useEffect(() => {
    loadDrivers();
  }, []);
function handleEdit(driver: Driver) {
  setEditingDriverId(driver.id);

  setFirstName(driver.firstName);
  setLastName(driver.lastName);
  setPhone(driver.phone ?? "");
  setEmail(driver.email ?? "");
  setLicenseNo(driver.licenseNo ?? "");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
async function handleDelete(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this driver?"
  );

  if (!confirmed) return;

  const response = await fetch(`/api/drivers/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    await loadDrivers();
    alert("Driver deleted successfully!");
  } else {
    alert("Unable to delete driver.");
  }
}
  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const url = editingDriverId
    ? `/api/drivers/${editingDriverId}`
    : "/api/drivers";

  const method = editingDriverId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  firstName,
  lastName,
  phone,
  email,
  licenseNo,
  password,
}),
  });
const result = await response.json();
  if (response.ok) {
    await loadDrivers();

    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setLicenseNo("");
    setPassword("");
    setEditingDriverId(null);

    alert(
      editingDriverId
        ? "Driver updated successfully!"
        : "Driver saved successfully!"
    );
  } else {
  alert(result.error || "Unable to save driver.");
}
}

  return (
    <AppLayout title="Drivers">
      <div className="space-y-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Add Driver
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                License Number
              </label>

              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
<div>
  <label className="block text-sm font-medium mb-1">
    Portal Password
  </label>

  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded border p-2"
    placeholder="Enter portal password"
  />
</div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Save Driver
              </button>
            </div>
          </form>
        </div>

        <DriverTable
  drivers={drivers}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

      </div>
    </AppLayout>
  );
}