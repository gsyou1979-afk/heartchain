import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'HeartChain API',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    };
  }
}
