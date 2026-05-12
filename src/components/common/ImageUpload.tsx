import { useRef, DragEvent, useState } from 'react';
import { Upload, X, Crop } from 'lucide-react';
import ImageCropper from './ImageCropper';

interface ImageUploadProps {
  image: File | null;
  imagePreview: string;
  isDragging: boolean;
  onImageChange: (file: File) => void;
  onRemove: () => void;
  onDragStateChange: (isDragging: boolean) => void;
  label?: string;
  enableCrop?: boolean;
  aspectRatio?: number;
}

export default function ImageUpload({
  image,
  imagePreview,
  isDragging,
  onImageChange,
  onRemove,
  onDragStateChange,
  label = 'Image',
  enableCrop = true,
  aspectRatio = 16/9
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragStateChange(true);
  };

  const handleDragLeave = () => {
    onDragStateChange(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragStateChange(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (enableCrop) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImage(reader.result as string);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      } else {
        onImageChange(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      if (enableCrop) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImage(reader.result as string);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      } else {
        onImageChange(file);
      }
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    onImageChange(croppedFile);
    setShowCropper(false);
    setTempImage('');
    // Prevent any form submission
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-1">Drag and drop an image here, or click to select</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB{enableCrop && ' • Will be cropped after selection'}</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden">
          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            {enableCrop && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTempImage(imagePreview);
                  setShowCropper(true);
                }}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                title="Crop image"
              >
                <Crop className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
}
