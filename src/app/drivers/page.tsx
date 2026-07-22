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

  async function loadDrivers() {
    const response = await fetch("/api/drivers");
    const data = await response.json();
    setDrivers(data);
  }

  useEffect(() => {
    loadDrivers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/drivers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email,
        licenseNo,
      }),
    });

    if (response.ok) {
      await loadDrivers();

      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setLicenseNo("");

      alert("Driver saved successfully!");
    } else {
      alert("Unable to save driver.");
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

        <DriverTable drivers={drivers} />

      </div>
    </AppLayout>
  );
}