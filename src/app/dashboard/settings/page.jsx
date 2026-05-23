'use client'
import React, { useState } from 'react'
import { Tag, CircleDot } from 'lucide-react'
import DashboardLayout from '../DashboardLayout'

const page = () => {
  const [activeTab, setActiveTab] = useState('tag')

  return (
    <DashboardLayout>
      <div className="grid h-full grid-cols-[220px_1fr]">
        
        {/* Sidebar */}
        <aside className="border border-gray-200 bg-[#223458] p-4 h-full">
          <nav className="space-y-2">
            
            <button
              type="button"
              onClick={() => setActiveTab('tag')}
              className={`flex w-full items-center gap-3 border-b border-gray-200 px-4 py-3 text-xs font-medium transition cursor-pointer ${
                activeTab === 'tag'
                  ? 'bg-white text-[#223458]'
                  : 'text-white hover:bg-[#2b426d]'
              }`}
            >
              <Tag size={12} />
              Tag
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`flex w-full items-center gap-3 border-b border-gray-200 px-4 py-3 text-xs font-medium transition cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-white text-[#223458]'
                  : 'text-white hover:bg-[#2b426d]'
              }`}
            >
              <CircleDot size={12} />
              Status
            </button>

          </nav>
        </aside>

        {/* Main Content */}
        <section className="border border-gray-200 bg-white p-6 shadow-sm">

          {activeTab === 'tag' && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Tag Management
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Manage all your CRM tags from here.
              </p>

              {/* Table */}
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Tag Name
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Color
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Leads
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Hot Lead
                      </td>

                      <td className="px-4 py-3">
                        <div className="h-4 w-4 rounded-full bg-red-500"></div>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        24
                      </td>
                    </tr>

                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Follow Up
                      </td>

                      <td className="px-4 py-3">
                        <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        12
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Status Management
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Manage lead statuses from here.
              </p>

              {/* Table */}
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Total Leads
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        New Lead
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        Active
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        45
                      </td>
                    </tr>

                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Closed
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        Completed
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        18
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>
      </div>
    </DashboardLayout>
  )
}

export default page