import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Search} from "../../../entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class ShopSearchService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly jwtService: JwtService
    ) {}

    private async DecryptToken(token: string): Promise<{userId: string}> {
        return new Promise(async (resolve, reject) => {
            const decoded: any = await this.jwtService.decode(token)
            resolve(decoded)
        })
    }

    async registerSearch(token: string, search: string): Promise<Search> {
        return new Promise(async (resolve, reject) => {
            const decoded = await this.DecryptToken(token)
            const newsear = new Search()
            newsear.search = search
            newsear.userId = decoded.userId
            this.connection.getRepository(Search)
                .save(newsear)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    async getAllSearch(token: string): Promise<Search[]> {
        return new Promise(async (resolve, reject) => {
            const decoded = await this.DecryptToken(token)
            this.connection.getRepository(Search).find({where:{userId: decoded.userId}, take: 10})
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }
}
