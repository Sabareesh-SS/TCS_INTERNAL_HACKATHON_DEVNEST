import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { qrService } from '../services/qrService';
import { Download, Printer, RefreshCw, MapPin, ExternalLink } from 'lucide-react';

interface QRCodePreviewProps {
  type: 'classroom' | 'device';
  targetId: string;
  targetName: string;
  location: string;
  identifierToken: string;
  modelOrRoomInfo?: string;
  onRegenerateToken?: () => void;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  type,
  targetId,
  targetName,
  location,
  identifierToken,
  modelOrRoomInfo,
  onRegenerateToken,
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const resolutionUrl = qrService.buildResolutionUrl(type, identifierToken);
  const securityHash = qrService.generateSecurityHash(identifierToken);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSvg = () => {
    const svgElement = labelRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `TSCAI_${type.toUpperCase()}_${targetId}_QR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-6 shadow-xs">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              {type === 'classroom' ? 'Classroom Entrance Tag' : 'Hardware Asset Tag'}
            </span>
            <span className="text-xs font-mono text-zinc-500">
              ID: {targetId}
            </span>
          </div>
          <h3 className="text-base font-bold text-zinc-900 mt-1">
            {targetName}
          </h3>
          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            {location} {modelOrRoomInfo ? `· ${modelOrRoomInfo}` : ''}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded font-medium transition-colors"
            title="Download high-resolution SVG"
          >
            <Download className="w-3.5 h-3.5" />
            SVG
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded font-medium transition-colors"
            title="Print ready label format"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          {onRegenerateToken && (
            <button
              onClick={onRegenerateToken}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded font-medium transition-colors"
              title="Regenerate token if label was compromised"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Revoke & Re-issue
            </button>
          )}
        </div>
      </div>

      {/* Printable Label Container */}
      <div className="flex justify-center">
        <div
          ref={labelRef}
          className="print-card w-full max-w-sm bg-white text-black p-5 rounded-md border-2 border-zinc-900 shadow-sm flex flex-col items-center text-center font-mono"
        >
          {/* Label Header */}
          <div className="w-full border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider block text-black">
                TSCAI SMART CAMPUS AV
              </span>
              <span className="text-xs font-extrabold tracking-tight text-black">
                {type === 'classroom' ? 'ROOM ENTRANCE QR' : 'EQUIPMENT CHASSIS TAG'}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 border border-black font-bold">
              {type === 'classroom' ? 'PORTAL' : 'DEVICE'}
            </span>
          </div>

          {/* QR Code Graphic */}
          <div className="p-3 bg-white border border-zinc-300 rounded mb-3">
            <QRCodeSVG
              value={resolutionUrl}
              size={168}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Identifier Badge */}
          <div className="w-full bg-zinc-100 border border-zinc-400 p-2 rounded mb-2">
            <div className="text-sm font-black tracking-wider text-black">
              {targetId}
            </div>
            <div className="text-[11px] font-medium text-zinc-700 truncate">
              {targetName}
            </div>
          </div>

          {/* Scan instructions */}
          <p className="text-[10px] text-zinc-800 leading-tight mb-2">
            {type === 'classroom'
              ? 'Point phone camera to browse room inventory or report AV issue'
              : 'Scan to view live health telemetry or report malfunction'}
          </p>

          {/* Footer Security Hash */}
          <div className="w-full pt-2 border-t border-zinc-300 flex items-center justify-between text-[9px] text-zinc-600">
            <span>SEC TOKEN: {securityHash}</span>
            <span>AV DISPATCH: x4820</span>
          </div>
        </div>
      </div>
    </div>
  );
};
