import { Module } from '@nestjs/common';
import { HealthcheckController } from '@/modules/infrastructure/controller';

@Module({
  controllers: [HealthcheckController],
})
export class InfrastructureModule {}
