import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generateQrCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate QR Code');
    }
  }

  generateClaimUrl(token: string): string {
      // In production, this URL should be from env config
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return `${frontendUrl}/setup?token=${token}`;
  }
}
