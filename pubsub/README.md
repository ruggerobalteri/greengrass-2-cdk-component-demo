# Welcome to Greengrass v2 Pubsub component built in CDK!

You can deploy this 1-stack CDK application by running `cdk deploy '*'`. The `--profile` paratemeter is supported.

When you modify the stack, if run `npm run build && npm test` the snapshot test will likely fail (this is normal).
Check the Cloud Formation snapshot differences and, if you agree with the changes, you can accept the new snapshot, by typing `npm test -- -u`

## Other Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
