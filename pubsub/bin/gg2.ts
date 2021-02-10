#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Gg2Stack } from '../lib/gg2-stack';

const app = new cdk.App();
new Gg2Stack(app, 'Gg2Stack');
