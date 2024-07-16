import React, { useState } from 'react';

const UploadComponent: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const chunkSize = 40 * 1024; // 40KB

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const chunkCount = Math.ceil(file.size / chunkSize);
      for (let start = 0; start < file.size; start += chunkSize) {
        const chunk = file.slice(start, start + chunkSize);
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('chunkIndex', (start / chunkSize).toString());
        formData.append('chunkCount', chunkCount.toString());
        formData.append('fileName', file.name);

        await fetch(`/api/upload-chunks?chunkIndex=${(start / chunkSize)}&chunkCount=${chunkCount}&fileName=${file.name}`, {
          method: 'POST',
          body: formData,
        });
      }
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};

export default UploadComponent;
