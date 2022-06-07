import { Module } from '@nestjs/common';
import { AuthControllerV1 } from './auth';

@Module({
  imports: [],
  controllers: [AuthControllerV1],
  providers: [],
})
export class AppModule {}
