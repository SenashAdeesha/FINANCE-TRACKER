// components/Card.tsx
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

function Card({ children, className = "", gradient = false, hover = true }: CardProps) {
  return (
    <div 
      className={`
        ${gradient 
          ? "bg-gradient-to-br from-white to-blue-50" 
          : "bg-white/80 backdrop-blur-sm"
        }
        rounded-2xl shadow-lg border border-white/50
        ${hover ? "hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
