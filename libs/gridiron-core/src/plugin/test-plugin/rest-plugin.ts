import {Controller, Get} from '@nestjs/common';
import {GridironPlugin} from '../gridiron-plugin';
import {PluginCommonModule} from '../plugin-common.module';

@Controller('products')
export class ProductsController {

    @Get()
    findAll() {
        return 'hello Plugin'
    }
}

/**
 * A proof-of-concept plugin which adds a REST endpoint for querying products.
 */
@GridironPlugin({
    imports: [PluginCommonModule],
    controllers: [ProductsController],
})
export class RestPlugin {}
