import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DynamicMetricData } from '@/types'
import { fetchDataAndSetData } from '@/utils'
import { initializeColumns } from '@/components/iotTable/columns'
import { showToast } from '@/components/Toast'
import { useSession } from 'next-auth/react'

function AuthCheckAndAction({
  children,
  setData,
  loading,
  setLoading,
  hasFetchedData,
  setHasFetchedData,
}: {
  children: React.ReactNode
  data: DynamicMetricData[]
  setData: (data: DynamicMetricData[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  hasFetchedData: boolean
  setHasFetchedData: (hasFetchedData: boolean) => void
}) {
  const { status } = useSession()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchedDataFromStorage = localStorage.getItem('fetchedData')
      const hasDataFetched = localStorage.getItem('hasDataFetched') === 'true'

      // Only proceed if the user is authenticated and data hasn't been fetched yet
      if (status === 'authenticated') {
        if (!hasDataFetched) {
          fetchDataAndUpdate()
        } else if (fetchedDataFromStorage) {
          setData(JSON.parse(fetchedDataFromStorage))
          setLoading(false)
        }
      } else {
        setData([])
        setLoading(false)
      }
    }
  }, [status, hasFetchedData, setData, setLoading])

  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true)
      const fetchedData = await fetchDataAndSetData()
      setData(fetchedData)
      setLoading(false)

      // Save the fetched data and set the flag in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fetchedData', JSON.stringify(fetchedData))
        localStorage.setItem('hasDataFetched', 'true')
      }

      // Initialize columns with dynamic metrics
      initializeColumns()

      if (!hasFetchedData) {
        setHasFetchedData(true)
      }

      console.log('fetching data for the ' + (hasFetchedData ? 'second' : 'first') + ' time')
      showToast({ message: 'Data Fetched!', type: 'success' })
    } catch (error) {
      showToast({
        message: 'Failed to fetch data: ' + error,
        type: 'error',
      })
    }
  }

  return (
    <>
      {loading ? (
        // Render loading animation when loading is true
        <div className="flex justify-center items-center h-screen">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <p>Loading Data...</p>
          </div>
        </div>
      ) : (
        // Render children when loading is false
        children
      )}
    </>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<DynamicMetricData[]>(() => {
    if (typeof window !== 'undefined') {
      // Load data from local storage on initial load
      const storedData = localStorage.getItem('fetchedData')
      return storedData ? JSON.parse(storedData) : []
    }
    return []
  })

  const [loading, setLoading] = useState(false)
  const [hasFetchedData, setHasFetchedData] = useState(() => {
    if (typeof window !== 'undefined') {
      // Load flag from local storage on initial load
      const storedHasFetchedData = localStorage.getItem('hasDataFetched')
      return storedHasFetchedData === 'true'
    }
    return false
  })

  // Define fetchDataAndUpdate in MyApp and pass it as a prop to the child components
  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true)
      const fetchedData = await fetchDataAndSetData()
      setData(fetchedData)
      setLoading(false)

      // Save the fetched data and set the flag in local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fetchedData', JSON.stringify(fetchedData))
        localStorage.setItem('hasDataFetched', 'true')
      }

      // Initialize columns with dynamic metrics
      initializeColumns()

      if (!hasFetchedData) {
        setHasFetchedData(true)
      }

      console.log('Fetching data for the ' + (hasFetchedData ? 'second' : 'first') + ' time')
      showToast({ message: 'Data Fetched!', type: 'success' })
    } catch (error) {
      showToast({
        message: 'Failed to fetch data: ' + error,
        type: 'error',
      })
    }
  }

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <AuthCheckAndAction
          data={data}
          setData={setData}
          loading={loading}
          setLoading={setLoading}
          hasFetchedData={hasFetchedData}
          setHasFetchedData={setHasFetchedData}
        >
          <Component data={data} {...pageProps} fetchDataAndUpdate={fetchDataAndUpdate} />
        </AuthCheckAndAction>
      </SessionProvider>
    </>
  )
}
