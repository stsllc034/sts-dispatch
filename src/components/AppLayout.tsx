import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AppLayout({
  title,
  children,
}: AppLayoutProps) {


  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-900 text-white px-8 py-4 shadow">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-5">

            <Image
              src="/images/sts-logo.png"
              alt="STS Logo"
              width={180}
              height={60}
              priority
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
              Administrator
            </p>

            <p className="text-blue-200 text-sm">
              Welcome Back
            </p>
          </div>

        </div>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen p-6">

          <h2 className="text-xl font-bold mb-6">
            Navigation
          </h2>

          <nav className="space-y-2">

            <Link
              href="/dashboard"
              className="block p-3 rounded hover:bg-gray-200"
            >
              🏠 Dashboard
            </Link>

            <Link
              href="/new-trip"
              className="block p-3 rounded hover:bg-gray-200"
            >
              🚍 New Trip
            </Link>

            <Link
              href="/active-trips"
              className="block p-3 rounded hover:bg-gray-200"
            >
              📋 Active Trips
            </Link>

            <Link
              href="/drivers"
              className="block p-3 rounded hover:bg-gray-200"
            >
              👨‍✈️ Drivers
            </Link>

            <Link
              href="/fleet"
              className="block p-3 rounded hover:bg-gray-200"
            >
              🚌 Fleet
            </Link>

            <Link
              href="/charter-parties"
              className="block p-3 rounded hover:bg-gray-200"
            >
              🏫 Charter Parties
            </Link>

            <Link
              href="/reports"
              className="block p-3 rounded hover:bg-gray-200"
            >
              📊 Reports
            </Link>

            <Link
              href="/settings"
              className="block p-3 rounded hover:bg-gray-200"
            >
              ⚙️ Settings
            </Link>

          </nav>

        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">

          <h2 className="text-3xl font-bold mb-6">
            {title}
          </h2>

          {children}

        </section>

      </div>

    </main>
  );
}