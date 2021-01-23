import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Injectable()
export class ChannelsService {

    constructor(
        @InjectConnection() private connection: Connection,
    ) {}

}
