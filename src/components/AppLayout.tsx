"use client";

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AppLayout({
  title,
  children,
}: AppLayoutProps) {
  const pathname = usePathname();
  const isDriver =
    pathname === "/driver" ||
    pathname.startsWith("/driver/");

   const [driverName, setDriverName] = useState("");

  useEffect(() => {
    if (!isDriver) return;

    async function loadDriverName() {
      try {
        const response = await fetch("/api/driver/me");
        const data: { firstName: string; lastName: string } = await response.json();

        if (response.ok) {
          setDriverName(`${data.firstName} ${data.lastName}`);
        }
      } catch (error) {
        console.error("Error loading driver name:", error);
      }
    }

    loadDriverName();
  }, [isDriver]);   

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-900 text-white px-4 py-3 md:px-8 md:py-4 shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-5">

            <Image
  src="/images/sts-logo.png"
  alt="STS Logo"
  width={180}
  height={60}
  priority
  className="w-[110px] h-auto sm:w-[180px]"
/>

            <div>
              <h1 className="text-3xl font-bold">
                STS Dispatch System
              </h1>

              <p className="text-blue-200">
                Stephens Transportation Services
              </p>
            </div>

          </div>

          <div className="text-right">
            <p className="font-semibold">
  {isDriver ? "Welcome Back" : "Administrator"}
</p>

<p className="text-blue-200 text-sm">
    {isDriver ? driverName : "Welcome Back"}
</p>
          </div>

        </div>
      </header>

      <div className="flex flex-col lg:flex-row">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white shadow-md min-h-0 lg:min-h-screen p-3 lg:p-6">

          <h2 className="text-xl font-bold mb-6">
            Navigation
          </h2>

          <nav className="flex flex-wrap gap-2 lg:block lg:space-y-2">
            {isDriver ? (
              <>
                <a
                  href="/driver"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  My Driver Portal
                </a>

                <a
                  href="/driver/calendar"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  My Calendar
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Dashboard
                </a>

                <a
                  href="/new-trip"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  New Trip
                </a>

                <a
                  href="/trips"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Active Trips
                </a>

                <a
                  href="/weekly-schedule"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Weekly Schedule
                </a>

<a
  href="/completed-trips"
  className="block p-3 rounded hover:bg-gray-200"
>
  Completed Trips
</a>

                <a
                  href="/drivers"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Drivers
                </a>

                <a
                  href="/fleet"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Fleet
                </a>

                <a
                  href="/charter-parties"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Charter Parties
                </a>

                <a
                  href="/reports"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Reports
                </a>

                <a
                  href="/settings"
                  className="block p-3 rounded hover:bg-gray-200"
                >
                  Settings
                </a>
              </>
            )}
          </nav>

        </aside>

        {/* Main Content */}
        <section className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {title}
            </h2>

            {!isDriver && (
              <a
                href="/dashboard"
                className="bg-white hover:bg-gray-200 text-blue-900 px-4 py-2 rounded-lg shadow font-semibold"
              >
                Dashboard
              </a>
            )}
          </div>

          {children}

        </section>

      </div>

    </main>
  );
}
