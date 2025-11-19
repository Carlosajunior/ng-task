import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators';

@Controller('health')
@ApiTags('Infrastructure')
export class HealthcheckController {
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Health check endpoint to verify API availability',
  })
  healthcheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
