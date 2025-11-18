import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Infrastructure')
export class HealthcheckController {
  @Get()
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
