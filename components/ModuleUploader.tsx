import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ModuleUploaderProps {
  onUploadSuccess: (moduleName: string) => void;
}

export default function ModuleUploader({ onUploadSuccess }: ModuleUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const moduleName = prompt('Enter module name:');
    if (!moduleName) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('moduleZip', file);
    formData.append('moduleName', moduleName);

    try {
      const response = await fetch('/upload-module', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Module uploaded successfully!');
        onUploadSuccess(moduleName);
      } else {
        setMessage('Upload failed.');
      }
    } catch (error) {
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-8">
      <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg cursor-pointer transition-colors">
        <Upload size={16} />
        {uploading ? 'Uploading...' : 'Upload Module Zip'}
        <input type="file" accept=".zip" onChange={handleUpload} className="hidden" />
      </label>
      {message && (
        <div className={`mt-2 flex items-center gap-2 text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
          {message.includes('success') ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {message}
        </div>
      )}
    </div>
  );
}
