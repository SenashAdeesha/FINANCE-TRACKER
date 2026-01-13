// components/Button.tsx
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-md",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:scale-105",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
