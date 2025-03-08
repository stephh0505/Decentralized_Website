/**
 * ChatInterface Component
 * Floating chat interface using Perplexity API
 */

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Convert markdown to HTML
  const markdownToHtml = (text) => {
    // Convert bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert code blocks
    text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    // Convert inline code
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    // Convert lists
    text = text.replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Convert headers
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    // Convert paragraphs
    text = text.replace(/\n\n/g, '</p><p>');
    text = `<p>${text}</p>`;
    // Fix any double-wrapped paragraphs
    text = text.replace(/<p><p>/g, '<p>');
    text = text.replace(/<\/p><\/p>/g, '</p>');
    
    return text;
  };

  // Format message with citations
  const formatMessageWithCitations = (text, citations) => {
    if (!citations || !Array.isArray(citations) || citations.length === 0) {
      return markdownToHtml(text);
    }

    // Sort citations by start_ix in descending order to avoid position shifts
    const sortedCitations = [...citations].sort((a, b) => b.start_ix - a.start_ix);

    // Convert markdown first
    let formattedText = text;

    // Add hyperlinks for citations
    sortedCitations.forEach((citation, index) => {
      if (citation.start_ix !== undefined && citation.end_ix !== undefined) {
        const citationId = `citation-${index + 1}`;
        const beforeText = formattedText.slice(0, citation.start_ix);
        const citedText = formattedText.slice(citation.start_ix, citation.end_ix);
        const afterText = formattedText.slice(citation.end_ix);

        // Create hyperlinked text with citation
        const linkedText = `<a href="${citation.url}" target="_blank" class="text-blue-400 hover:text-blue-300 border-b border-blue-400">${citedText}</a><sup><a href="#${citationId}" class="text-blue-400 hover:text-blue-300 ml-0.5">[${index + 1}]</a></sup>`;

        formattedText = beforeText + linkedText + afterText;
      }
    });

    // Convert markdown after adding citations
    formattedText = markdownToHtml(formattedText);

    // Add citations list at the bottom
    formattedText += '<div class="mt-4 pt-2 border-t border-gray-600">';
    sortedCitations.forEach((citation, index) => {
      formattedText += `
        <div id="citation-${index + 1}" class="mt-1 text-sm text-gray-400">
          [${index + 1}] <a href="${citation.url}" target="_blank" class="text-blue-400 hover:text-blue-300 underline">${citation.title || citation.url}</a>
        </div>`;
    });
    formattedText += '</div>';

    return formattedText;
  };

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Sending message to backend:', userMessage);
      // Call backend API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { 
        message: userMessage 
      });
      
      console.log('Received response from backend:', response.data);
      
      if (response.data.success && typeof response.data.response === 'string') {
        // Add AI response to chat with citations
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: response.data.response,
          citations: response.data.citations
        }]);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || error.message || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-colors duration-300"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-700 p-4 border-b border-gray-600">
            <h3 className="text-white font-semibold">GhostFund Assistant</h3>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: message.type === 'ai' && message.citations 
                        ? formatMessageWithCitations(message.content, message.citations)
                        : markdownToHtml(message.content)
                    }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-600">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 