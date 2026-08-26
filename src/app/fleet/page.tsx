"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";

export default function FleetPage() {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState<any>(null);

  const [newBus, setNewBus] = useState({
  busNumber: "",
  year: "",
  make: "",
  model: "",
  vin: "",
  licensePlate: "",
  seatingCapacity: "",
  status: "Available",
});
  async function loadBuses() {
  const response = await fetch("/api/fleet");
  const data = await response.json();

  console.log("Buses from database:", data);

  setBuses(data);
}

async function saveBus() {
  const response = await fetch("/api/fleet", {
    method: editingBus ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: editingBus?.id,
      busNumber: newBus.busNumber,
      year: newBus.year ? Number(newBus.year) : null,
      make: newBus.make,
      model: newBus.model,
      vin: newBus.vin,
      licensePlate: newBus.licensePlate,
      seatingCapacity: newBus.seatingCapacity
        ? Number(newBus.seatingCapacity)
        : null,
      status: newBus.status,
    }),
  });

  if (!response.ok) {
    alert("Unable to save bus.");
    return;
  }

   setEditingBus(null);

setNewBus({
  busNumber: "",
  year: "",
  make: "",
  model: "",
  vin: "",
  licensePlate: "",
  seatingCapacity: "",
  status: "Available",
});

  setShowForm(false);
  loadBuses();
}

useEffect(() => {
    loadBuses();
  }, []);
  useEffect(() => {
  if (editingBus) {
   setNewBus(editingBus); 
  }
}, [editingBus]);

  return (
    <AppLayout title="Fleet">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Fleet Management</h2>

        <p className="text-gray-600 mb-6">
          This page will manage all buses and vehicles in the STS fleet.
        </p>
<div className="mb-6">
<button
  onClick={() => {
  setEditingBus(null);
  setShowForm(!showForm);
}}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
  + Add Bus
</button>
</div>
{showForm && (
  <div className="border rounded-lg p-6 mb-6 bg-gray-50">
    <h3 className="text-xl font-semibold mb-4">
  {editingBus ? "Edit Bus" : "Add New Bus"}
</h3>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <div>
    <label className="block text-sm font-medium mb-1">
      Bus Number
    </label>
    <input
  type="text"
  value={newBus.busNumber}
  onChange={(e) =>
    setNewBus({ ...newBus, busNumber: e.target.value })
  }
  placeholder="01"
  className="w-full border rounded-lg px-3 py-2"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Year
    </label>
    <input
  type="number"
  value={newBus.year}
  onChange={(e) =>
    setNewBus({ ...newBus, year: e.target.value })
  }
  placeholder="2024"
  className="w-full border rounded-lg px-3 py-2"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Make
    </label>
    <input
  type="text"
  value={newBus.make}
  onChange={(e) =>
    setNewBus({ ...newBus, make: e.target.value })
  }
  placeholder="Ford"
  className="w-full border rounded-lg px-3 py-2"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Model
    </label>
    <input
  type="text"
  value={newBus.model}
  onChange={(e) =>
    setNewBus({ ...newBus, model: e.target.value })
  }
  placeholder="E-450"
  className="w-full border rounded-lg px-3 py-2"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      License Plate
    </label>
    <input
  type="text"
  value={newBus.licensePlate}
  onChange={(e) =>
    setNewBus({ ...newBus, licensePlate: e.target.value })
  }
  placeholder="ABC123"
  className="w-full border rounded-lg px-3 py-2"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Seating Capacity
    </label>
    <input
  type="number"
  value={newBus.seatingCapacity}
  onChange={(e) =>
    setNewBus({ ...newBus, seatingCapacity: e.target.value })
  }
  placeholder="56"
  className="w-full border rounded-lg px-3 py-2"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Status
    </label>

    <select
  value={newBus.status}
  onChange={(e) =>
    setNewBus({ ...newBus, status: e.target.value })
  }
  className="w-full border rounded-lg px-3 py-2"
>
      <option>Available</option>
      <option>Out of Service</option>
      <option>Maintenance</option>
    </select>
  </div>

</div>

<div className="flex gap-3 mt-6">

  <button
  onClick={saveBus}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
>
  {editingBus ? "Update Bus" : "Save Bus"}
</button>

  <button
    onClick={() => {
  setEditingBus(null);
  setNewBus({
    busNumber: "",
    year: "",
    make: "",
    model: "",
    vin: "",
    licensePlate: "",
    seatingCapacity: "",
    status: "Available",
  });
  setShowForm(false);
}}
    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
  >
    Cancel
  </button>

</div>
  </div>
)}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Total Fleet</h3>
            <p className="text-3xl font-bold text-blue-600">
  {buses.length}
</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Available</h3>
            <p className="text-3xl font-bold text-green-600">
  {buses.filter((bus: any) => bus.status === "Available").length}
</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Out of Service</h3>
            <p className="text-3xl font-bold text-red-600">
  {buses.filter((bus: any) => bus.status === "Out of Service").length}
</p>
          </div>
        </div><div className="mt-8">
  <h3 className="text-xl font-bold mb-4">Fleet List</h3>

  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-3 py-2">Bus #</th>
          <th className="border px-3 py-2">Year</th>
          <th className="border px-3 py-2">Make</th>
          <th className="border px-3 py-2">Model</th>
          <th className="border px-3 py-2">License Plate</th>
          <th className="border px-3 py-2">Seats</th>
          <th className="border px-3 py-2">Status</th>
        </tr>
      </thead>

      <tbody>
        {buses.map((bus: any) => (
          <tr key={bus.id}>
            <td className="border px-3 py-2">{bus.busNumber}</td>
            <td className="border px-3 py-2">{bus.year}</td>
            <td className="border px-3 py-2">{bus.make}</td>
            <td className="border px-3 py-2">{bus.model}</td>
            <td className="border px-3 py-2">{bus.licensePlate}</td>
            <td className="border px-3 py-2">{bus.seatingCapacity}</td>
            <td className="border px-3 py-2">
  <span
    className={`px-2 py-1 rounded-full text-sm font-semibold ${
      bus.status === "Available"
        ? "bg-green-100 text-green-800"
        : bus.status === "Maintenance"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {bus.status}
  </span>
</td>
<td className="border px-3 py-2">
  <button
    onClick={() => {
  console.log("Edit clicked:", bus);
  setEditingBus(bus);
  setShowForm(true);
}}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
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
      </div>
    </AppLayout>
  );
}