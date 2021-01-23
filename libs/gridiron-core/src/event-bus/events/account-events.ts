import { User } from "@gridiron/entities";
import {GridIronEvents} from "../gridIron-events";

export class AccountRegisterEvents extends GridIronEvents {
    constructor(
        public user: User
    ) {
        super();
    }
}

export class PasswordResetEvents extends GridIronEvents {
    constructor(
        public user: User,
        public resetcode: string
    ) {
        super();
    }
}
