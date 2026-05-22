import React from 'react'
import { Tag } from 'lucide-react'
import DashboardLayout from '../DashboardLayout'

const page = () => {
  return (
    <DashboardLayout>
      <div className="grid h-full grid-cols-[220px_1fr]">
        <aside className=" border border-gray-200 bg-white p-4  h-full">
          <nav className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3  border-b border-gray-200 cursor-pointer  px-4 py-3 text-sm font-medium text-blue-600 transition "
            >
              <Tag size={18} />
              Tag
            </button>
             <button
              type="button"
              className="flex w-full items-center gap-3 border-b border-gray-200 cursor-pointer  px-4 py-3 text-sm font-medium text-blue-600 transition "
            >
              <Tag size={18} />
              Status
            </button>
          </nav>
        </aside>

        <section className=" border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Tag</h1>
          <p className="mt-3 text-sm text-gray-600">
            Choose an option from the side navigation to manage tags.
          </p>
        </section>
          <section className=" border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Status</h1>
          <p className="mt-3 text-sm text-gray-600">
            Choose an option from the side navigation to manage status.
          </p>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default page