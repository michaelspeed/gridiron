import {CustomScalar, Scalar} from '@nestjs/graphql';
import {Kind} from 'graphql';

@Scalar('JSON')
export class GqlJson implements CustomScalar<object, object>{
    description: 'JSON Object Custom Scalar';

    parseLiteral(ast: any): object {
        if (ast.kind === Kind.OBJECT) {
            return new Object(ast.value)
        }
    }

    parseValue(value: object): object {
        return value;
    }

    serialize(value: any): object {
        return value
    }

}
