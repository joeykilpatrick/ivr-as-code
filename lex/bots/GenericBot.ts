import type { LexV2Handler } from 'aws-lambda';

import { LexBotHandler } from "../LexBotHandler";
import { FallbackHandler } from "../handlers/FallbackHandler";
import { EmptySlotsHandler } from "../handlers/EmptySlotsHandler";


export const handler: LexV2Handler =
    new LexBotHandler()
    .addRequestHandlers([
        EmptySlotsHandler,
        FallbackHandler
    ])
    .handler;
