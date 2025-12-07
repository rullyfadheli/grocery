"use client";

import React from "react";

/**
 * Typing indicator component that shows animated dots when bot is typing
 */
const TypingIndicator = (): React.JSX.Element => {
  return (
    <div className="flex items-start space-x-2 max-w-[75%]">
      <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center space-x-1.5">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></span>
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
