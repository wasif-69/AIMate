import React, { useState } from 'react'
import Header_chat from './header_chat'
import Chat_text from './chat_text'
import Chat_Input from './chat_Input'

export default function CHAT() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
    <Header_chat/>
    <Chat_text isLoading={isLoading} />
    <Chat_Input setIsLoading={setIsLoading} isLoading={isLoading}/>
    </>
  )
}
