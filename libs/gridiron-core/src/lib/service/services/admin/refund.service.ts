import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Refund} from "../../../entity";
import {RefundEnum} from "../../../enums";

@Injectable()
export class RefundService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}
}
