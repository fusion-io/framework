import {container} from "@fusion.io/container";
import {KERNEL, REGISTRY, registry, ROUTER} from "../src/Http";
import Koa from "koa";
import Router from "koa-router";
import ConfigManager from "../src/Config/ConfigManager";
import {Config} from "../src";

const kernel = new Koa();
const router = new Router();
const config = new ConfigManager({ });

config.setEnv('testing', {});

container.value(KERNEL, kernel);
container.value(ROUTER, router);
container.value(REGISTRY, registry);
container.value(Config, config);
