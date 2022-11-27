import type {ConnectContactFlowEvent} from "aws-lambda";
import "reflect-metadata";

import type {ConnectAttributeMap} from "./types";
import {DiContainer} from "./dependencyContainer";
import {StateMachineLambda} from "./StateMachineLambda";

const stateMachineLambda: StateMachineLambda = DiContainer.resolve<StateMachineLambda>(StateMachineLambda);

export async function handler(event: ConnectContactFlowEvent): Promise<ConnectAttributeMap> {
  return await stateMachineLambda.handler(event);
}
