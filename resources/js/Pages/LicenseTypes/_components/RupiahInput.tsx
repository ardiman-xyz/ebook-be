import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface RupiahInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    showCurrency?: boolean;
}

const RupiahInput: React.FC<RupiahInputProps> = ({
    value,
    onChange,
    placeholder = "0",
    disabled = false,
    className = "",
    showCurrency = true,
}) => {
    const [displayValue, setDisplayValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Format number to Indonesian locale (1.000.000)
    const formatNumber = (num: number): string => {
        if (num === 0) return "";
        return num.toLocaleString("id-ID");
    };

    // Parse formatted string back to number
    const parseNumber = (str: string): number => {
        // Remove all non-numeric characters except dots
        const cleaned = str.replace(/[^\d]/g, "");
        return cleaned === "" ? 0 : parseInt(cleaned, 10);
    };

    // Format with currency prefix
    const formatWithCurrency = (num: number): string => {
        if (num === 0) return "";
        const formatted = formatNumber(num);
        return showCurrency ? `Rp ${formatted}` : formatted;
    };

    // Update display value when prop value changes
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatWithCurrency(value));
        }
    }, [value, isFocused, showCurrency]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow only numbers, dots, spaces, and 'Rp' text
        const allowedChars = /^[0-9\s.Rp]*$/;
        if (!allowedChars.test(inputValue)) {
            return;
        }

        // Parse the number from input
        const numericValue = parseNumber(inputValue);

        // Update the numeric value
        onChange(numericValue);

        // Update display value during typing
        if (isFocused) {
            // Show formatted number without currency during typing for easier editing
            setDisplayValue(
                numericValue === 0 ? "" : formatNumber(numericValue)
            );
        }
    };

    // Handle focus
    const handleFocus = () => {
        setIsFocused(true);
        // Remove currency prefix and show just numbers for easier editing
        setDisplayValue(value === 0 ? "" : formatNumber(value));
    };

    // Handle blur
    const handleBlur = () => {
        setIsFocused(false);
        // Add back currency formatting
        setDisplayValue(formatWithCurrency(value));
    };

    // Handle key press (only allow numbers)
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow backspace, delete, tab, escape, enter
        if (
            [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)
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
        <Input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            autoComplete="off"
        />
    );
};

export default RupiahInput;
