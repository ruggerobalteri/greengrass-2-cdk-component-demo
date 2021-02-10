import * as cdk from '@aws-cdk/core';
import * as fs from 'fs';
import * as gg from '@aws-cdk/aws-greengrassv2';
import * as s3 from "@aws-cdk/aws-s3"
import * as s3deploy from "@aws-cdk/aws-s3-deployment"
import * as s3asset from "@aws-cdk/aws-s3-assets"
import * as iam from "@aws-cdk/aws-iam"
import * as path from 'path';

export class Gg2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ggRoleArn = "arn:aws:iam::144932442613:role/GreengrassV2TokenExchangeRole"
    
    const ggBucket = new s3.Bucket(this, 'ggBucket');
    
    // const componentDeployment = new s3deploy.BucketDeployment(this, 'componentDeployment', {
    //   sources: [s3deploy.Source.asset('./lib/component/1.0.0')],
    //   destinationBucket: ggBucket,
    // });
    // componentDeployment.node.addDependency(ggBucket);
    const componentAsset = new s3asset.Asset(this, 'SampleAsset', {
      path: path.join(__dirname, './lib/component/1.0.0'),
    });
    componentAsset.node.addDependency(ggBucket)
    

    const ggBucketName = ggBucket.bucketName
    const componentRecipe = fs.readFileSync('./lib/component/recipe.yml', {
      encoding: 'utf-8'
    }).replace('#BUCKET',ggBucketName)


    const bucketAccessPolicy = new iam.Policy(this, "BucketAccessPolicy",{
      policyName: "GGV2ComponentArtifactPolicy"
    })
    const policyStatement = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [`arn:aws:s3:::${ggBucketName}/*`]
      }
    )
    bucketAccessPolicy.addStatements(policyStatement)

    const ggRole = iam.Role.fromRoleArn(this, 'Role', ggRoleArn, {
      // Set 'mutable' to 'false' to use the role as-is and prevent adding new
      // policies to it. The default is 'true', which means the role may be
      // modified as part of the deployment.
      mutable: true,
    });
    bucketAccessPolicy.attachToRole(ggRole)
    const pubsubComponent = new gg.CfnComponentVersion(this, "PubsubComponent", {
      inlineRecipe: componentRecipe
    })
    pubsubComponent.node.addDependency(componentDeployment);
  }
}
