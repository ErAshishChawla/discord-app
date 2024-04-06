"use client";

import React from "react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import { ApiEndpoints } from "@/app/api/uploadthing/core";
import { X } from "lucide-react";

interface FileUploadProps {
  endPoint: ApiEndpoints;
  onChange: (url?: string) => void;
  value: string;
}

function FileUpload({ endPoint, onChange, value }: FileUploadProps) {
  const fileType = value.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          type="button"
          className="bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
          onClick={() => {
            onChange("");
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        if (res.length > 0) {
          onChange(res[0].url);
        }

        return;
      }}
    />
  );
}

export default FileUpload;
