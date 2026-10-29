export interface QRCodeMeta {
  type: 'classroom' | 'device';
  targetId: string;
  targetName: string;
  location: string;
  identifierToken: string;
  generatedAt: string;
  resolutionUrl: string;
  securityHash: string;
}

export const qrService = {
  buildResolutionUrl: (type: 'classroom' | 'device', identifierToken: string): string => {
    // Protected backend resolution URL that looks up the latest live Supabase record
    const baseUrl = window.location.origin;
    if (type === 'classroom') {
      return `${baseUrl}/?scan=room&token=${encodeURIComponent(identifierToken)}`;
    }
    return `${baseUrl}/?scan=device&token=${encodeURIComponent(identifierToken)}`;
  },

  generateSecurityHash: (identifier: string): string => {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = (hash << 5) - hash + identifier.charCodeAt(i);
      hash |= 0;
    }
    return `SEC-${Math.abs(hash).toString(16).toUpperCase()}`;
  },

  downloadQRCanvasAsPng: (canvasId: string, filename: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  printLabel: () => {
    window.print();
  },
};
