import React, { forwardRef } from "react";
import { Eye, EyeOff, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

interface PasswordFieldProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

interface NumericFieldProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  prefix?: string;
  suffix?: string;
}

interface DateFieldProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId =
      id || `text-field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          type="text"
          className={cn(
            "transition-all duration-200",
            "focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          )}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId =
      id || `password-field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "pr-10 transition-all duration-200",
              "focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            )}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";

export const NumericField = forwardRef<HTMLInputElement, NumericFieldProps>(
  (
    { label, error, hint, required, prefix, suffix, className, id, ...props },
    ref,
  ) => {
    const inputId =
      id || `numeric-field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">
                {prefix === "$" ? <DollarSign className="h-4 w-4" /> : prefix}
              </span>
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            type="number"
            className={cn(
              "transition-all duration-200",
              "focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
              prefix && "pl-10",
              suffix && "pr-10",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            )}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">{suffix}</span>
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

NumericField.displayName = "NumericField";

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId =
      id || `date-field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              "pr-10 transition-all duration-200",
              "focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            )}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

DateField.displayName = "DateField";
