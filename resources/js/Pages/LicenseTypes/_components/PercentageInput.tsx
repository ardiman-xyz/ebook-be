// components/PercentageInput.tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Percent } from "lucide-react";

interface PercentageInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    min?: number;
    max?: number;
    showIcon?: boolean;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
    value,
    onChange,
    placeholder = "0",
    disabled = false,
    className = "",
    min = 0,
    max = 100,
    showIcon = true,
}) => {
    const [displayValue, setDisplayValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Format number with percentage
    const formatPercentage = (num: number): string => {
        if (num === 0) return "";
        return `${num}%`;
    };

    // Format number without percentage (for editing)
    const formatNumber = (num: number): string => {
        if (num === 0) return "";
        return num.toString();
    };

    // Parse string back to number
    const parseNumber = (str: string): number => {
        // Remove all non-numeric characters
        const cleaned = str.replace(/[^\d.]/g, "");
        const parsed = parseFloat(cleaned);

        if (isNaN(parsed)) return 0;

        // Ensure within bounds
        return Math.min(Math.max(parsed, min), max);
    };

    // Update display value when prop value changes
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatPercentage(value));
        }
    }, [value, isFocused]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow only numbers, dots, and % symbol
        const allowedChars = /^[0-9.%]*$/;
        if (!allowedChars.test(inputValue)) {
            return;
        }

        // Parse the number from input
        const numericValue = parseNumber(inputValue);

        // Update the numeric value
        onChange(numericValue);

        // Update display value during typing
        if (isFocused) {
            // Show just numbers during typing for easier editing
            setDisplayValue(numericValue === 0 ? "" : numericValue.toString());
        }
    };

    // Handle focus
    const handleFocus = () => {
        setIsFocused(true);
        // Remove percentage symbol for easier editing
        setDisplayValue(value === 0 ? "" : value.toString());
    };

    // Handle blur
    const handleBlur = () => {
        setIsFocused(false);
        // Add back percentage formatting
        setDisplayValue(formatPercentage(value));
    };

    // Handle key press (only allow numbers and decimal)
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow backspace, delete, tab, escape, enter
        if (
            [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow decimal point
            e.keyCode === 190 ||
            e.keyCode === 110
        ) {
            return;
        }

        // Ensure that it is a number and stop the keypress
        if (
            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
            (e.keyCode < 96 || e.keyCode > 105)
        ) {
            e.preventDefault();
        }
    };

    return (
        <div className="relative">
            <Input
                type="text"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className={`${showIcon ? "pr-10" : ""} ${className}`}
                autoComplete="off"
            />
            {showIcon && (
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            )}
        </div>
    );
};

export default PercentageInput;
