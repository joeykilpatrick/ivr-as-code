import * as AWS from "aws-sdk";
import {AsyncContainerModule, Container} from "inversify";
import {transformAndValidateSync} from "class-transformer-validator";
import "source-map-support/register"; // TODO Evaluate

import {Environment} from "./environment";

const dependencyContainer: AsyncContainerModule = new AsyncContainerModule(async (bind) => {
    bind(Environment).toDynamicValue(() => transformAndValidateSync(Environment, process.env))
    bind(AWS.Connect).toDynamicValue(() => new AWS.Connect())
});

const DiContainer: Container = new Container({skipBaseClassChecks: true});
DiContainer.loadAsync(dependencyContainer);

export {DiContainer};
