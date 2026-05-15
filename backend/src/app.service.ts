import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'HeartChain API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  getInfo() {
    return {
      name: 'HeartChain (哈特链)',
      version: '1.0.0',
      description: 'Blockchain-based Volunteer Service Platform - 区块链好人好事记录平台',
      endpoints: {
        api: '/api/v1',
        docs: '/api/v1/docs',
      },
      features: [
        'Task publishing & matching',
        'HeartCoin (HRT) point system with blockchain',
        'Triple endorsement mechanism',
        'Team/organization management',
        'Multi-language (CN/KR)',
        'Dual-chain architecture (Polygon + Substrate)',
      ],
    };
  }
}
