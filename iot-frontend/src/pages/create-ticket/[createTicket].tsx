import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function fetchDeviceId() {
  //Fetches deviceId from Url
  const pathname = usePathname()
  const parts = pathname ? pathname.split('/') : []
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0 // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId
}

const isEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)

const CreateTicket = (data: any) => {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState(`Hi team, There is something wrong with...`)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [ticketCreated, setTicketCreated] = useState(false) // State to track if ticket is successfully created
  const deviceId = fetchDeviceId()
  const filteredData = flattenNestedData(data, deviceId)
  const deviceData = filteredData[0]

  const handleCreateTicket = async () => {
    // Reset errors
    setErrors({})

    // Validate fields
    const validationErrors: { [key: string]: string } = {}
    if (!to) validationErrors.to = 'To field is required'
    if (!subject.trim()) validationErrors.subject = 'Subject field is required'
    if (!message.trim()) validationErrors.message = 'Message field is required'
    if (!isEmail(to)) validationErrors.to = 'Invalid email format'

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, message, deviceData }),
      })

      if (response.ok) {
        console.log('Ticket created successfully')
        setTicketCreated(true) // Set ticket created state to true
      } else {
        console.error('Error creating ticket')
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex-grow flex flex-col container mx-auto p-6 py-5">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Create Ticket</h2>
            </div>

            <div className="mb-8">
              <p className="text-black-600 text-center mb-4">
                Ticket will be sent to support@adroit.co.nz
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Device Information</h3>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Device ID:</span>{' '}
                    {deviceData?.device_id}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Device Key:</span>{' '}
                    {deviceData?.device_key}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Client Name:</span>{' '}
                    {deviceData?.client_name}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Last Online:</span>{' '}
                    {typeof deviceData?.last_online === 'string'
                      ? deviceData.last_online
                      : deviceData?.last_online?.value || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Last ticket created:</span> Never
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Ticket Details</h3>
                  {ticketCreated && (
                    <p className="text-green-600 mb-4">
                      Thank You, the Ticket has been successfully submitted!
                    </p>
                  )}
                  <div className="mb-4">
                    <label htmlFor="to" className="font-semibold text-gray-600">
                      To:
                    </label>
                    <input
                      id="to"
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                      className="border border-gray-300 p-2 rounded-md bg-white w-full"
                    />
                    {errors.to && <p className="text-red-500 mt-1">{errors.to}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className="font-semibold text-gray-600">
                      Subject:
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="border border-gray-300 p-2 rounded-md bg-white w-full"
                    />
                    {errors.subject && <p className="text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="font-semibold text-gray-600">
                      Message:
                    </label>
                    <textarea
                      id="message"
                      className="border border-gray-300 p-2 rounded-md bg-white w-full h-40"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                    {errors.message && <p className="text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 shadow-md"
                      onClick={handleCreateTicket}
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CreateTicket
