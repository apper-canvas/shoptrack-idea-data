import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  className,
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-2.5 border rounded-md transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        error ? "border-red-500" : "border-slate-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;