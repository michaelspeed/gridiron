import { Module } from '@nestjs/common';
import { AssetServerPluginService } from './asset-server-plugin.service';

@Module({
  providers: [AssetServerPluginService],
  exports: [AssetServerPluginService],
})
export class AssetServerPluginModule {}
