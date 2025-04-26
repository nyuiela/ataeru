'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sendChatMessage } from '@/lib/services/fertility-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: `Hello! I'm your FertilityAI assistant. I can help you with:
- Understanding our fertility services
- Sperm donation information
- Donor compensation details
- Finding the right donation opportunity
- Treatment costs and options

How can I assist you today?`
  }
];

export default function FertilityAI() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // States for chat UI
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages and threadId from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('fertilityAIMessages');
      const savedThreadId = localStorage.getItem('fertilityAIThreadId');
      
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error('Failed to parse saved messages', e);
        }
      }
      
      if (savedThreadId) {
        setThreadId(savedThreadId);
      }
    }
  }, []);

  // Save messages and threadId to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fertilityAIMessages', JSON.stringify(messages));
      if (threadId) {
        localStorage.setItem('fertilityAIThreadId', threadId);
      }
    }
  }, [messages, threadId]);

  // Function to collapse the button after inactivity
  const startCollapseTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!isOpen) {
        setIsExpanded(false);
      }
    }, 3000); // Collapse after 3 seconds of inactivity
  }, [isOpen]);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsExpanded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle closing the chat
  const handleClose = () => {
    setIsOpen(false);
    startCollapseTimer();
  };

  // Expand on hover or scroll
  const handleMouseEnter = () => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    expandTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
      startCollapseTimer();
    }, 100); // Small delay to prevent flicker
  };

  // Set up scroll listener to expand the button when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsExpanded(true);
      startCollapseTimer();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
    };
  }, [startCollapseTimer]);

  // Start collapse timer when component mounts or isOpen changes
  useEffect(() => {
    startCollapseTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen, startCollapseTimer]);

  const processUserMessage = async (userMessage: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Process with our API service
      const { response, threadId: newThreadId } = await sendChatMessage(userMessage, threadId);
      
      // Save the threadId for future messages
      if (newThreadId && newThreadId !== threadId) {
        setThreadId(newThreadId);
      }
      
      // Add AI response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble processing your request right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    processUserMessage(inputValue);
    setInputValue('');
  };

  const navigateToRecommendations = () => {
    router.push('/ai/recommendations');
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50"
      onMouseEnter={handleMouseEnter}
    >
      {/* Chat Button */}
      <button 
        onClick={toggleChat}
        className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out flex items-center justify-center overflow-hidden ${isExpanded ? 'w-auto px-4 py-3 sm:px-5 sm:py-4' : 'w-14 h-14 sm:w-16 sm:h-16'}`}
        style={{ boxShadow: isExpanded 
          ? '0 15px 30px -5px rgba(59, 130, 246, 0.5), 0 4px 6px -2px rgba(59, 130, 246, 0.3)' 
          : '0 20px 35px -10px rgba(59, 130, 246, 0.6), 0 8px 10px -5px rgba(59, 130, 246, 0.4)'
        }}
      >
        {!isExpanded ? (
          <div className="flex items-center justify-center w-full h-full relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-lg sm:text-xl">AI</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-lg sm:text-xl">AI</span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <span className="font-medium text-base sm:text-lg whitespace-nowrap font-lato">Chat with FertilityAI</span>
          </div>
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem] sm:max-w-none bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideIn"
          style={{ 
            boxShadow: '0 25px 30px -10px rgba(0, 0, 0, 0.15), 0 12px 15px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-lg sm:text-xl">AI</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base font-lato">FertilityAI Assistant</h3>
                <p className="text-xs sm:text-sm text-blue-100">Online | Typical reply in 2s</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 sm:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'gap-2 sm:gap-3'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs sm:text-sm">
                    AI
                  </div>
                )}
                <div className={`${message.role === 'user' ? 'max-w-[80%]' : 'flex-1'}`}>
                  <div 
                    className={`${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' 
                        : 'bg-gray-100 rounded-2xl rounded-tl-none text-gray-800'
                    } p-3 sm:p-4 text-xs sm:text-sm`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                    
                    {/* Show recommendation button if message contains the trigger word */}
                    {message.role === 'assistant' && 
                     (message.content.toLowerCase().includes('personalized recommendation') || 
                      message.content.toLowerCase().includes('donation opportunit')) && (
                      <button
                        onClick={navigateToRecommendations}
                        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        View Recommendations
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs sm:text-sm">
                  AI
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 sm:p-4 text-gray-500">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={isLoading || inputValue.trim() === ''}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
              Your conversation is private and secure. Medical advice is for information only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}