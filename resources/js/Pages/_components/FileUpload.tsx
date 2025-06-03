import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Upload,
    File as FileIcon,
    Image,
    X,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

interface FileUploadProps {
    id?: string;
    label?: string;
    description?: string;
    value?: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    disabled?: boolean;
    accept?: string;
    maxSize?: number; // in MB
    className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    id = "file-upload",
    label = "Upload File",
    description = "Select a file to upload",
    value,
    onChange,
    error,
    disabled = false,
    accept = ".pdf,.jpg,.jpeg,.png,.gif,.webp",
    maxSize = 5,
    className = "",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            onChange(null);
            setPreview(null);
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            onChange(null);
            return;
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            onChange(null);
            return;
        }

        onChange(file);

        // Generate preview for images
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const removeFile = () => {
        handleFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openFileDialog = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (file: File) => {
        if (file.type === "application/pdf") {
            return <FileIcon className="h-8 w-8 text-red-500" />;
        } else if (file.type.startsWith("image/")) {
            return <Image className="h-8 w-8 text-blue-500" />;
        }
        return <FileIcon className="h-8 w-8 text-gray-500" />;
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <Label
                    htmlFor={id}
                    className="text-gray-700 dark:text-gray-300"
                >
                    {label}
                </Label>
            )}

            <div className="space-y-3">
                {/* Upload Area */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                    className={`
            relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${
                dragActive
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600"
            }
            ${
                error
                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            dark:bg-gray-700
          `}
                >
                    <input
                        ref={fileInputRef}
                        id={id}
                        type="file"
                        accept={accept}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className="hidden"
                    />

                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                Click to upload
                            </span>
                            {" or drag and drop"}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            PDF, JPEG, PNG, GIF, WebP up to {maxSize}MB
                        </p>
                    </div>
                </div>

                {/* File Preview */}
                {value && (
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {getFileIcon(value)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {value.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(value.size)}
                                    </p>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeFile}
                                disabled={disabled}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Image Preview */}
                        {preview && (
                            <div className="mt-3">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-w-full h-32 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
