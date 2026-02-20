
"use client";

import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";

export interface DropZoneProps {
  accept?: Accept;
  multiple?: boolean;
  maxSize?: number;
  onDrop?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  preview?: boolean;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getReadableError = (rejection: FileRejection, maxSize?: number): string[] => {
  return rejection.errors.map((error) => {
    if (error.code === "file-too-large") {
      const limit = maxSize ? formatFileSize(maxSize) : "the size limit";
      return `${rejection.file.name}: exceeds max size (${limit}).`;
    }

    if (error.code === "file-invalid-type") {
      return `${rejection.file.name}: unsupported file type.`;
    }

    if (error.code === "too-many-files") {
      return "Too many files selected.";
    }

    return `${rejection.file.name}: ${error.message}`;
  });
};

const baseClasses =
  "relative flex min-h-40 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center outline-none transition-colors";

export const DropZone = React.memo(function DropZone({
  accept,
  multiple = false,
  maxSize = DEFAULT_MAX_SIZE,
  onDrop,
  disabled = false,
  className = "",
  preview = true,
}: DropZoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const errorId = useId();

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setErrors([]);
    onDrop?.([]);
  }, [onDrop]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setErrors([]);

      if (fileRejections.length > 0) {
        setSelectedFiles([]);
        const rejectionMessages = fileRejections.flatMap((rejection) =>
          getReadableError(rejection, maxSize)
        );
        setErrors(rejectionMessages);
        onDrop?.([]);
        return;
      }

      const normalizedFiles = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);
      setSelectedFiles(normalizedFiles);
      onDrop?.(normalizedFiles);
    },
    [maxSize, multiple, onDrop]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    accept,
    disabled,
    maxSize,
    multiple,
    noClick: true,
    noKeyboard: true,
    onDrop: handleDrop,
  });

  const firstFile = selectedFiles[0] ?? null;

  useEffect(() => {
    if (!preview || !firstFile || !firstFile.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(firstFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [firstFile, preview]);

  const hasFile = selectedFiles.length > 0;

  const mergedClassName = useMemo(() => {
    const stateClass = disabled
      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
      : isDragReject || errors.length > 0
        ? "border-red-500 bg-red-50 text-red-700"
        : isDragActive
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400";

    return `${baseClasses} ${stateClass} ${className}`.trim();
  }, [className, disabled, errors.length, isDragActive, isDragReject]);

  const rootProps = getRootProps({
    className: mergedClassName,
    role: "button",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled,
    "aria-label": hasFile ? "File selected. Press Enter to replace file." : "File upload area",
    "aria-describedby": errors.length > 0 ? errorId : undefined,
    onClick: disabled
      ? undefined
      : () => {
          open();
        },
    onKeyDown: disabled
      ? undefined
      : (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        },
  });

  return (
    <div className="w-full">
      <div {...rootProps}>
        <input {...getInputProps()} />

        {!hasFile && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">
              {isDragActive ? "Drop file(s) here" : "Drag and drop file(s) here"}
            </span>
            <span className="text-xs text-gray-500">or press Enter/Space to browse</span>
            {maxSize ? (
              <span className="text-xs text-gray-500">Max size: {formatFileSize(maxSize)}</span>
            ) : null}
          </div>
        )}

        {hasFile && (
          <div className="relative flex w-full items-center gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={firstFile?.name ?? "Uploaded preview"}
                className="h-20 w-20 rounded-md border border-gray-200 object-cover"
              />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-2 text-xs font-medium uppercase text-gray-600"
                aria-hidden="true"
              >
                File
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col text-left">
              <span className="truncate text-sm font-medium">{firstFile?.name}</span>
              <span className="text-xs text-gray-500">{firstFile ? formatFileSize(firstFile.size) : ""}</span>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                clearFiles();
              }}
              disabled={disabled}
              aria-label="Remove selected file"
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-sm leading-none text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              X
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 ? (
        <ul id={errorId} role="alert" className="mt-2 space-y-1 text-xs text-red-600">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

export default DropZone;
