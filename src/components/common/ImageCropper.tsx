import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: File) => void;
  onCancel: () => void;
  aspectRatio?: number; // width/height, e.g., 16/9, 1 for square
}

export default function ImageCropper({ image, onCropComplete, onCancel, aspectRatio = 16/9 }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const imgElement = new Image();
    imgElement.src = image;
    imgElement.onload = () => {
      setImg(imgElement);
      // Center the image
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        setPosition({
          x: (canvas.width - imgElement.width * zoom) / 2,
          y: (canvas.height - imgElement.height * zoom) / 2
        });
      }
    };
  }, [image]);

  useEffect(() => {
    if (img && canvasRef.current) {
      drawCanvas();
    }
  }, [img, zoom, rotation, position]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply transformations
    ctx.translate(position.x + (img.width * zoom) / 2, position.y + (img.height * zoom) / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
    ctx.restore();

    // Draw crop area overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear crop area
    const cropWidth = canvas.width * 0.8;
    const cropHeight = cropWidth / aspectRatio;
    const cropX = (canvas.width - cropWidth) / 2;
    const cropY = (canvas.height - cropHeight) / 2;
    
    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
    
    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cropWidth = canvas.width * 0.8;
    const cropHeight = cropWidth / aspectRatio;
    const cropX = (canvas.width - cropWidth) / 2;
    const cropY = (canvas.height - cropHeight) / 2;

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const ctx = croppedCanvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      // Convert to blob and then to file
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          onCropComplete(file);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Crop Image</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 cursor-move mx-auto"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-48"
          />
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => setRotation((rotation + 90) % 360)}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            title="Rotate"
          >
            <RotateCw size={20} />
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Check size={20} />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
