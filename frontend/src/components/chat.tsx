import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { MessageCircle, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Message {
  id: number;
  text: any;
  sender: 'user' | 'api';
}

interface ApiResponse {
  id: number;
  response: string;
  resposta: string
}

export function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === '' || isLoading) return

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    }

    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
        const response = await axios.post<ApiResponse>('http://127.0.0.1:3000/api/', {
            question: inputMessage
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        const apiMessage: Message = {
            id: Date.now(),
            text: response.data.resposta,
            sender: 'api'
        }

      setMessages(prevMessages => [...prevMessages, apiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now(),
        text: 'Sorry, there was an error processing your request.',
        sender: 'api'
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[30rem] h-[30rem] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t flex">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 mr-2"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Button onClick={toggleChat} size="icon" className="rounded-full h-12 w-12">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}