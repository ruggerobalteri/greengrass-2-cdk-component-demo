import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
  SynthUtils,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as pubsub from "../lib/pubsub-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new pubsub.pubsubStack(app, "MyTestStack");
  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
