'use client'

import { useState } from 'react'
import {
  Globe,
  Link2,
  CheckCircle2,
  Copy,
  Webhook,
  Database,
  ArrowRight,
} from 'lucide-react'
import DashboardLayout from '../DashboardLayout'

export default function WordpressConnectionPage() {
  const [copied, setCopied] = useState(false)

  const webhookUrl =
    'https://yourcrm.com/api/webhooks/wordpress'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            WordPress Connection
          </h1>

          <p className="text-gray-500 mt-2">
            Connect WordPress forms with your CRM using Webhooks.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Webhook URL */}
            <div className="bg-white rounded-3xl border p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Webhook className="text-blue-600" size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    CRM Webhook URL
                  </h2>

                  <p className="text-sm text-gray-500">
                    Paste this URL inside your WordPress form plugin.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-3">
                <input
                  value={webhookUrl}
                  readOnly
                  className="bg-transparent outline-none flex-1 text-sm text-gray-700"
                />

                <button
                  onClick={handleCopy}
                  className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Plugin Options */}
            <div className="bg-white rounded-3xl border p-6 shadow-sm">

              <h2 className="text-xl font-semibold mb-6">
                Supported WordPress Forms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="border rounded-2xl p-5 hover:border-blue-500 transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="text-blue-600" />
                    <h3 className="font-semibold">Contact Form 7</h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Use CF7 webhook plugin to send leads directly into CRM.
                  </p>
                </div>

                <div className="border rounded-2xl p-5 hover:border-blue-500 transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="text-blue-600" />
                    <h3 className="font-semibold">WPForms</h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Connect WPForms using webhook integration.
                  </p>
                </div>

                <div className="border rounded-2xl p-5 hover:border-blue-500 transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="text-blue-600" />
                    <h3 className="font-semibold">Elementor Forms</h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Use Elementor webhook action after submit.
                  </p>
                </div>

                <div className="border rounded-2xl p-5 hover:border-blue-500 transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="text-blue-600" />
                    <h3 className="font-semibold">Fluent Forms</h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Easily push lead data into CRM database.
                  </p>
                </div>

              </div>
            </div>

            {/* Flow */}
            <div className="bg-white rounded-3xl border p-6 shadow-sm">

              <h2 className="text-xl font-semibold mb-6">
                Connection Flow
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-3">
                    <Globe className="text-blue-600" size={28} />
                  </div>

                  <h3 className="font-semibold">WordPress Form</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    User submits form
                  </p>
                </div>

                <ArrowRight className="text-gray-400 hidden md:block" />

                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-3">
                    <Webhook className="text-purple-600" size={28} />
                  </div>

                  <h3 className="font-semibold">Webhook</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Sends lead data
                  </p>
                </div>

                <ArrowRight className="text-gray-400 hidden md:block" />

                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
                    <Database className="text-green-600" size={28} />
                  </div>

                  <h3 className="font-semibold">CRM Database</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Lead stored automatically
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">

            {/* Setup Steps */}
            <div className="bg-white rounded-3xl border p-6 shadow-sm sticky top-6">

              <h2 className="text-xl font-semibold mb-6">
                Quick Setup
              </h2>

              <div className="space-y-5">

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    1
                  </div>

                  <div>
                    <h3 className="font-medium">
                      Install Webhook Plugin
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Install webhook addon or plugin in WordPress.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    2
                  </div>

                  <div>
                    <h3 className="font-medium">
                      Paste CRM Webhook URL
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Add your CRM webhook URL inside form settings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    3
                  </div>

                  <div>
                    <h3 className="font-medium">
                      Map Form Fields
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Connect name, phone, email, notes etc.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    4
                  </div>

                  <div>
                    <h3 className="font-medium">
                      Start Receiving Leads
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Leads automatically enter your CRM.
                    </p>
                  </div>
                </div>

              </div>

              <button className="w-full mt-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-medium flex items-center justify-center gap-2">
                <Link2 size={18} />
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
