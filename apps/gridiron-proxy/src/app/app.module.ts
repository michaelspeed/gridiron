import { Module } from '@nestjs/common';
import { ProxyModule } from "@nestcloud/proxy";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environment } from '../environments/environment.prod';

@Module({
  imports: [
    ProxyModule.forRoot({
      routes: [
        {
          id: 'admin-api',
          uri: `http://localhost:5588/admin-api/`
        },
        {
          id: 'shop-api',
          uri: `http://${environment.host}:5588/shop-api/`
        },
        {
          id: 'controller',
          uri: `http://${environment.host}:5588/`
        },
        {
          id: 'images',
          uri: `http://${environment.host}:5002/`
        },
        {
          id: 'megartron',
          uri: `http://${environment.host}:3000/`
        },
        {
          id: 'olaf',
          uri: `http://${environment.host}:6060/`
        }
      ]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
