import { Controller, Post, Body } from '@nestjs/common';

import { logQueries } from '@zougui/log.database';

@Controller('/api/v1')
export class AppController {
  @Post('/logs')
  async createLog(@Body() body: any) {
    console.log('create logs')
    await logQueries.createMany(body.logs);
    console.log('logs created')
  }
}
