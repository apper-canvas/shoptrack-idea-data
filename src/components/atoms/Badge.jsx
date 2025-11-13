import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default",
  className,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200",
    warning: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;