"use client";

import React, { useCallback, useState } from "react";
import type { Accept } from "react-dropzone";
import DropZone from "../common/dropZone";

const IMAGE_ACCEPT: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export default function ProfileImageUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
  }, []);

  return (
    <section className="mx-auto w-full max-w-md space-y-3">
      <h2 className="text-base font-semibold text-gray-900">Profile Image</h2>

      <DropZone
        accept={IMAGE_ACCEPT}
        multiple={false}
        maxSize={2 * 1024 * 1024}
        onDrop={handleDrop}
        preview
        className="min-h-44"
      />

      <p className="text-xs text-gray-500">
        Allowed: JPG, PNG, WEBP. Max size: 2 MB.
      </p>

      <p className="text-sm text-gray-700">
        Selected file: {file ? file.name : "None"}
      </p>
    </section>
  );
}
