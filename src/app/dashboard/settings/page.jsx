import React from 'react'
import { Tag } from 'lucide-react'
import DashboardLayout from '../DashboardLayout'

const page = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-[220px_1fr] gap-6">
        <aside className=" border border-gray-200 bg-white p-4 shadow-sm">
          <nav className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl  px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <Tag size={18} />
              Tag
            </button>
          </nav>
        </aside>

        <section className=" border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-3 text-sm text-gray-600">
            Choose an option from the side navigation to manage settings.
          </p>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default page