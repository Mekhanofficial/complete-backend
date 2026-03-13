import {Injectable,NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import * as QrCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

    async createOrder(data: any) {
        const tarckingId = `TRK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const trackingUrl = `process.env.APP_URL}/track/${tarckingId}`;
        const QrCode = await QrCode.toDataURL(trackingUrl);

        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        const deliveryPinHash = crypto.createHash('sha256').update(pin).digest('hex');
    }