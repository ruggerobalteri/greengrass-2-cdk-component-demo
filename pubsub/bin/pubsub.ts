#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { pubsubStack } from "../lib/pubsub-stack";

const app = new cdk.App();
new pubsubStack(app, "Greengrassv2PubsubCdkComponentStack");
