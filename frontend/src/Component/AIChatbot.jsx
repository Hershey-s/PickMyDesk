import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, HelpCircle } from "lucide-react";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hi! I'm your PickMyDesk AI assistant. I can help you with booking workspaces, finding the perfect space, or answering any questions about our platform. How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // AI Response Logic
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Booking-related queries
    if (message.includes("book") || message.includes("reservation")) {
      return "I can help you book a workspace! To make a booking, browse our available workspaces, select your preferred dates and times, and click 'Book Now'. You'll need to be logged in to complete your booking. Would you like me to guide you through the process?";
    }
    
    // Pricing queries
    if (message.includes("price") || message.includes("cost") || message.includes("fee")) {
      return "Our workspace prices vary by location and amenities. Most spaces range from ₹300-₹2000 per hour. You can filter by price range when browsing workspaces. Premium spaces with more amenities typically cost more. Would you like to see workspaces in a specific price range?";
    }
    
    // Location queries
    if (message.includes("location") || message.includes("where") || message.includes("city")) {
      return "We have workspaces in major Indian cities including Mumbai, Delhi, Bangalore, Pune, and more! You can search by location or use our nearby location feature to find spaces close to you. Which city are you looking for?";
    }
    
    // Amenities queries
    if (message.includes("amenity") || message.includes("wifi") || message.includes("coffee") || message.includes("parking")) {
      return "Our workspaces offer various amenities like high-speed WiFi, coffee, meeting rooms, parking, air conditioning, and more. You can filter workspaces by specific amenities when browsing. What amenities are most important to you?";
    }
    
    // Cancellation queries
    if (message.includes("cancel") || message.includes("refund")) {
      return "You can cancel your booking from the 'My Bookings' section in your dashboard. Cancellation policies may vary by workspace. For refunds, please contact the workspace owner directly or reach out to our support team.";
    }
    
    // Account/Login queries
    if (message.includes("login") || message.includes("account") || message.includes("sign up")) {
      return "You can create an account or log in using your email or Google account. Having an account allows you to book workspaces, manage your bookings, and get personalized recommendations. Need help with login issues?";
    }
    
    // Recommendations queries
    if (message.includes("recommend") || message.includes("suggest") || message.includes("best")) {
      return "I can provide smart recommendations based on your booking history and preferences! Our AI analyzes your past bookings to suggest workspaces you'll love. Check out the 'Smart Recommendations' section on your dashboard for personalized suggestions.";
    }
    
    // Admin queries
    if (message.includes("admin") || message.includes("list") || message.includes("workspace owner")) {
      return "If you're a workspace owner, you can create an admin account to list and manage your workspaces. Admin accounts have access to workspace creation, booking management, and analytics. Would you like to know more about becoming a workspace provider?";
    }
    
    // General help
    if (message.includes("help") || message.includes("how") || message.includes("what")) {
      return "I'm here to help! You can ask me about:\n• Booking workspaces\n• Pricing and payments\n• Available locations\n• Workspace amenities\n• Account management\n• Cancellations\n• Becoming a workspace provider\n\nWhat specific topic would you like help with?";
    }
    
    // Greeting responses
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to PickMyDesk. I'm here to help you find and book the perfect workspace. What can I assist you with today?";
    }
    
    // Thank you responses
    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! I'm always here to help. Is there anything else you'd like to know about PickMyDesk?";
    }
    
    // Default response
    return "I understand you're asking about that topic. While I try to help with most questions, I might not have all the answers. For specific issues, you can:\n• Check our FAQ section\n• Contact our support team\n• Try rephrasing your question\n\nIs there something specific about workspace booking I can help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How do I book a workspace?",
    "What are your prices?",
    "Which locations do you have?",
    "How do I cancel a booking?",
    "What amenities are available?",
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-purple-600 hover:bg-purple-700"
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center gap-2">
            <Bot size={20} />
            <div>
              <h3 className="font-semibold">PickMyDesk AI Assistant</h3>
              <p className="text-xs text-purple-100">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "bot" && (
                      <Bot size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                    )}
                    {message.sender === "user" && (
                      <User size={16} className="text-white mt-1 flex-shrink-0" />
                    )}
                    <div className="text-sm whitespace-pre-line">
                      {message.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-xs">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                <HelpCircle size={12} />
                Quick questions:
              </p>
              <div className="space-y-1">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="block w-full text-left text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-1 rounded"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
