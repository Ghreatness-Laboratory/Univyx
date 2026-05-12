import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export default function ImageCropper({ image, onCropComplete, onCancel, aspectRatio = 16/9 }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    imgElement.src = image;
    imgElement.onload = () => {
      setImg(imgElement);
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const scale = Math.min(canvas.width / imgElement.width, canvas.height / imgElement.height);
        setZoom(scale * 0.8);
        setPosition({
          x: canvas.width / 2,
          y: canvas.height / 2
        });
      }
    };
  }, [image]);

  useEffect(() => {
    if (img && canvasRef.current && imageCanvasRef.current) {
      drawCanvas();
    }
  }, [img, zoom, rotation, position]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const imageCanvas = imageCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    const imgCtx = imageCanvas?.getContext('2d');
    if (!canvas || !ctx || !imageCanvas || !imgCtx || !img) return;

    // Draw image on hidden canvas with transformations
    imgCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imgCtx.save();
    imgCtx.translate(position.x, position.y);
    imgCtx.rotate((rotation * Math.PI) / 180);
    imgCtx.scale(zoom, zoom);
    imgCtx.drawImage(img, -img.width / 2, -img.height / 2);
    imgCtx.restore();

    // Draw on visible canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageCanvas, 0, 0);

    // Draw overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate crop area
    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;
    let cropWidth = maxWidth;
    let cropHeight = cropWidth / aspectRatio;
    
    if (cropHeight > maxHeight) {
      cropHeight = maxHeight;
      cropWidth = cropHeight * aspectRatio;
    }
    
    const cropX = (canvas.width - cropWidth) / 2;
    const cropY = (canvas.height - cropHeight) / 2;
    
    // Clear crop area
    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
    ctx.drawImage(imageCanvas, cropX, cropY, cropWidth, cropHeight, cropX, cropY, cropWidth, cropHeight);
    
    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
    
    // Draw corner markers
    ctx.fillStyle = '#fff';
    const markerSize = 20;
    const markerThickness = 3;
    [[cropX, cropY], [cropX + cropWidth, cropY], [cropX, cropY + cropHeight], [cropX + cropWidth, cropY + cropHeight]].forEach(([x, y]) => {
      ctx.fillRect(x - (x === cropX ? 0 : markerSize), y - (y === cropY ? 0 : markerThickness), markerSize, markerThickness);
      ctx.fillRect(x - (x === cropX ? 0 : markerThickness), y - (y === cropY ? 0 : markerSize), markerThickness, markerSize);
    });
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

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const imageCanvas = imageCanvasRef.current;
    if (!canvas || !imageCanvas) return;

    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;
    let cropWidth = maxWidth;
    let cropHeight = cropWidth / aspectRatio;
    
    if (cropHeight > maxHeight) {
      cropHeight = maxHeight;
      cropWidth = cropHeight * aspectRatio;
    }
    
    const cropX = (canvas.width - cropWidth) / 2;
    const cropY = (canvas.height - cropHeight) / 2;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const ctx = croppedCanvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(imageCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          onCropComplete(file);
        }
      }, 'image/jpeg', 0.95);
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

        <div className="mb-4 relative">
          <canvas
            ref={imageCanvasRef}
            width={800}
            height={600}
            className="hidden"
          />
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 cursor-move mx-auto rounded-lg"
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
