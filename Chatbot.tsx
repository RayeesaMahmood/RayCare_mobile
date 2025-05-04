
'use client';

import { chatbotRespond } from '@/ai/flows/chatbot-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Send, User, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

   // Add initial bot message when chat opens
   useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: "Hello! How can I help you today? Ask about appointments, emergencies, or departments." }]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const newUserMessage: Message = { sender: 'user', text: trimmedInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Replace direct call to getBotResponse with Genkit flow
      const botResponse = await chatbotRespond({ userMessage: trimmedInput });
      const newBotMessage: Message = { sender: 'bot', text: botResponse.reply };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from the bot.',
      });
       // Add a generic error message to the chat
       const errorBotMessage: Message = { sender: 'bot', text: "Sorry, I encountered an error. Please try again later." };
       setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
      // Ensure focus stays on input after sending
      document.getElementById('user-input')?.focus();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Icon */}
      <div
        id="chat-icon"
        onClick={toggleChat}
        className={cn(
          'fixed bottom-5 right-5 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg text-2xl hover:bg-primary/90 transition-colors',
          isOpen ? 'hidden' : 'flex' // Hide icon when chat is open
        )}
        role="button"
        aria-label="Open Chat"
      >
        <Bot size={28} />
      </div>

      {/* Chat Container */}
      <div
        id="chat-container"
        className={cn(
          'fixed bottom-5 right-5 z-50 w-80 rounded-lg border bg-card shadow-xl flex flex-col transition-all duration-300 ease-in-out',
           // Adjusted width and positioning
          isOpen ? 'h-[28rem] opacity-100 visible' : 'h-0 opacity-0 invisible' // Animate height and opacity
        )}
      >
        {/* Header */}
        <div id="chat-header" className="flex items-center justify-between p-3 border-b bg-muted/40 rounded-t-lg">
          <span className="font-semibold text-card-foreground">AI Healthcare Bot</span>
          <button
            id="close-chat"
            onClick={toggleChat}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close Chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Box */}
        <ScrollArea ref={chatBoxRef} className="flex-1 p-3 bg-background" id="chat-box">
          <div className="flex flex-col space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'message flex items-start gap-2 text-sm max-w-[85%] p-2 rounded-md',
                  msg.sender === 'user' ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-secondary text-secondary-foreground'
                )}
              >
                {msg.sender === 'bot' && <Bot size={16} className="flex-shrink-0 mt-0.5" />}
                <span>{msg.text}</span>
                {msg.sender === 'user' && <User size={16} className="flex-shrink-0 mt-0.5" />}
              </div>
            ))}
             {isLoading && (
               <div className="message self-start bg-secondary text-secondary-foreground p-2 rounded-md flex items-center gap-2">
                 <Bot size={16} />
                 <span className="italic">Typing...</span>
               </div>
             )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div id="chat-input-container" className="flex gap-2 p-3 border-t bg-muted/40 rounded-b-lg">
          <Input
            id="user-input"
            type="text"
            placeholder="Ask a question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow bg-background focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} size="icon" aria-label="Send Message">
             <Send size={18} />
          </Button>
        </div>
      </div>
    </>
  );
}
