/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BootstrapServer } from '@gridiron/gridiron-core';
import { environment } from './environments/environment.prod';

async function bootstrap() {
  BootstrapServer(environment.defConfig)
}

bootstrap();
