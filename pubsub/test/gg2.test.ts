import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Gg2 from '../lib/gg2-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Gg2.Gg2Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
