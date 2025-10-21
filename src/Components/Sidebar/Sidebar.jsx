import React, { useState } from 'react';
import { Menu, Plus, MessageSquare, HelpCircle, Clock, Settings } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [recentChats, setRecentChats] = useState([
    'What is React?',
    'Explain AI fundamentals',
    'JavaScript best practices',
    'How to use Tailwind CSS',
    'Machine learning basics'
  ]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNewChat = () => {
    console.log('New chat started');
  };

  const handleChatClick = (index) => {
    setActiveItem(index);
    console.log('Selected chat:', recentChats[index]);
  };

  const bottomMenuItems = [
    { icon: HelpCircle, label: 'Help', action: () => console.log('Help clicked') },
    { icon: Clock, label: 'Activity', action: () => console.log('Activity clicked') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings clicked') }
  ];

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className={`
        relative h-full 
        bg-[#1E1E1E] 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        flex flex-col
        border-r border-gray-800
        shadow-xl
      `}>
        {/* Top Section */}
        <div className="p-3 space-y-3">
          {/* Menu Toggle */}
          <button 
            onClick={toggleSidebar} 
            className="
              w-10 h-10
              flex items-center justify-center
              hover:bg-gray-700/50 
              rounded-lg 
              transition-all duration-200
              group
            "
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
          </button>

          {/* New Chat Button */}
          <button 
            onClick={handleNewChat}
            className={`
              flex items-center 
              w-full 
              hover:bg-gray-700/50 
              px-3 py-2.5
              rounded-lg 
              transition-all duration-200
              group
              ${isOpen ? 'justify-start' : 'justify-center'}
            `}
          >
            <Plus className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors shrink-0" />
            {isOpen && (
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                New Chat
              </span>
            )}
          </button>

          {/* Recent Chats Section */}
          {isOpen && (
            <div className="mt-6 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Recent
              </p>
              <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
                {recentChats.map((chat, index) => (
                  <button
                    key={index}
                    onClick={() => handleChatClick(index)}
                    className={`
                      flex items-center 
                      w-full
                      px-3 py-2.5
                      rounded-lg 
                      cursor-pointer 
                      transition-all duration-200
                      group
                      ${activeItem === index 
                        ? 'bg-gray-700/70 text-white' 
                        : 'hover:bg-gray-700/50 text-gray-300'
                      }
                    `}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="ml-3 text-sm truncate text-left">
                      {chat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto p-3 space-y-1 border-t border-gray-800">
          {bottomMenuItems.map(({ icon: Icon, label, action }, index) => (
            <button
              key={index}
              onClick={action}
              className={`
                flex items-center 
                w-full
                hover:bg-gray-700/50 
                px-3 py-2.5
                rounded-lg 
                cursor-pointer 
                transition-all duration-200
                group
                ${isOpen ? 'justify-start' : 'justify-center'}
              `}
            >
              <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors shrink-0" />
              {isOpen && (
                <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">
                  {label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

    
    
    </div>
  );
};

export default Sidebar;