#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkAwscustomresourceStack } from '../lib/cdk-awscustomresource-stack';

const app = new cdk.App();
new CdkAwscustomresourceStack(app, 'CdkAwscustomresourceStack');
