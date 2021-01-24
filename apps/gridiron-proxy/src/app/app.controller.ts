import { All, Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Proxy, InjectProxy } from "@nestcloud/proxy";
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller('/app/:service')
export class AppController {
  constructor(
    private readonly appService: AppService,
      @InjectProxy() private readonly proxy: Proxy,
    ) {}

  @All()
  do(@Req() req:Request, @Res() res: Response, @Param('service') id) {
    this.proxy.forward(req, res, id)
  }
}
