import {IsString} from "class-validator";

export class Environment {

    @IsString()
    AWS_REGION!: string;

    @IsString()
    CONNECT_INSTANCE_ID!: string;

    @IsString()
    MAIN_MENU_BOT_ALIAS_ARN!: string;

    @IsString()
    TIC_TAC_TOE_BOT_ALIAS_ARN!: string;

    @IsString()
    YES_NO_BOT_ALIAS_ARN!: string;

}
