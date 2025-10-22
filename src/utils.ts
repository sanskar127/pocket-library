import crypto from 'crypto';
import Ffmpeg from 'fluent-ffmpeg';
import fs from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import qrcode from 'qrcode-terminal';
import os from 'os'
import { cachingFile, media } from './states';
import path from 'path';

// Sanitize file names for Windows (and general safety)
export const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\-_.]/g, '_');
};

// Check if thumbnail exists and is valid (size >1KB)
export const thumbnailExistsAndValid = (filePath: string): boolean => {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > 1024; // >1KB is an arbitrary validity check
  } catch {
    return false;
  }
};

// Generate short ID from a given input
export const generateShortId = (input: string): string => {
  return crypto
    .createHash('sha1')
    .update(input)
    .digest('base64')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
    .slice(0, 8);
};

// Generate thumbnail using ffmpeg
export const generateThumbnail = (videoPath: string, outputPath: string, duration: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const seekTime = Math.floor(duration / 2);

    Ffmpeg(videoPath)
      .inputOptions(['-ss', String(seekTime)])
      .outputOptions([
        '-vframes', '1',
        '-vf', 'scale=480:270:force_original_aspect_ratio=decrease', // <-- updated scale filter
        '-c:v', 'libwebp',
        '-qscale:v', '80',
        '-preset', 'default'
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
      .run();
  });
};

// Retrieve local machine's IP address
export const getLocalIPAddress = (): string | null => {
  const inc = /eth|en|wlan|wl|wifi|usb|rndis|rmnet|ecm|wi-fi|ethernet|local area/i;
  const exc = /loopback|vmnet|vbox|virtual|hyper|vpn|br-|docker|nat|host|tap|tun|veth|bridge/i;

  for (const name in os.networkInterfaces()) {
    if (inc.test(name) && !exc.test(name)) {
      for (const { address, family, internal } of os.networkInterfaces()[name] || []) {
        if (family === 'IPv4' && !internal) return address;
      }
    }
  }
  return null;
};

// Generate QR code
export const generateQrCode = (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    qrcode.generate(data, { small: true }, (qr) => {
      if (!qr) {
        reject('Error generating QR code');
      } else {
        resolve(qr);
      }
    });
  });
};

export const writeJsonFileAsync = (): Promise<void> => {
  const dir = path.dirname(cachingFile);

  return mkdir(dir, { recursive: true }) // Ensure the directory exists
    .then(() => {
      // Convert media object to JSON string
      const jsonString = JSON.stringify(media, null, 2);

      // Write the JSON to the file
      return writeFile(cachingFile, jsonString);
    })
    .then(() => {
      console.log('File written successfully to:', cachingFile);
    })
    .catch((error) => {
      console.error('Error writing JSON file:', error);
      throw error; // Rethrow the error to maintain the rejected promise
    });
};