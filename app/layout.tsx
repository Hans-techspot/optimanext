import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import './globals.css'
// import { Inter } from 'next/font/google'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import '@xterm/xterm/css/xterm.css';
// import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster'
import BeautifulBackground from './background'

// const paytoneOne = localFont({
  // src: './fonts/PaytoneOne.ttf',
  // display: 'swap',
// });

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BoltNext',
  description: 'Generate full stack apps using AI',
  icons: {
    icon: '/faviconround.ico', // Path to your favicon file
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
      <SidebarProvider className='max-h-[100vh]'>
      <AppSidebar className=''/>
      <SidebarInset>
      <BeautifulBackground />
        <SidebarTrigger className=''/>
      <div className=" text-white relative overflow-hidden h-full">
      
        {/* Main Content */}
        <main className="mx-auto px-3 w-full relative h-full overflow-auto">
          {children}
        </main>
      </div>
      </SidebarInset>
        <Toaster />
      </SidebarProvider>
      </body>
    </html>
  )
}
