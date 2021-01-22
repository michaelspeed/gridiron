import {Module} from '@nestjs/common';
import {JobQueueService} from './job-queue.service';
import {ConfigModule} from '../config';

@Module({
  imports: [ConfigModule],
  providers: [JobQueueService],
  exports: [JobQueueModule, JobQueueService]
})
export class JobQueueModule {}
