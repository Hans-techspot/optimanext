'use client'

import { RefCallback, useRef, useState } from 'react'
import { FileSpreadsheet, Layout, FootprintsIcon as Shoe, Code } from 'lucide-react'
import { Message } from 'postcss'
import Chat from '@/components/chat/Chat'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import BeautifulBackground from './background'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'

export default function Home({}) {

  return (
    <>  
          <Chat />
      <Toaster />
      </>
  )
}

