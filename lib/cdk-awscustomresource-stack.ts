import * as cdk from '@aws-cdk/core';

import * as lambda from "@aws-cdk/aws-lambda";

import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';

export class CdkAwscustomresourceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here

        const getParameter = new AwsCustomResource(this, 'GetParameter', {
            onUpdate: { // will also be called for a CREATE event
                service: 'SSM',
                action: 'getParameter',
                parameters: {
                    Name: 'test-ssm-token',
                    WithDecryption: true
                },
                physicalResourceId: PhysicalResourceId.of(Date.now().toString()) // Update physical id to always fetch the latest version
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE })
        });

        new cdk.CfnOutput(this, "ParameterValue", {
            value: getParameter.getResponseField('Parameter.Value'),
        });

        /*
        console.log("******" + getParameter.node.findAll());

        console.log("@@@" + getParameter.node.defaultChild);
        
        console.log("&&&" + getParameter.node.children););

        console.log(
            getParameter.node.children.filter((child) => child instanceof lambda.SingletonFunction)
        );
        */

        //const provider = getParameter.node.children.filter((child) => child instanceof lambda.SingletonFunction).pop() as lambda.SingletonFunction;

        //console.log("$$$" + provider.node.children);

        //const provider2 = getParameter.node.findChild('Provider') as lambda.SingletonFunction;

        //console.log("$$$222" + provider2.node.defaultChild);


        /*
        getParameter.node.children.forEach(child => {
            console.log("?");
            console.log(child.toString());
            if (child instanceof lambda.SingletonFunction) {
                console.log("!");
                console.log(child.node.children);
                console.log(child.node.defaultChild);
                //const cfnResource = child.node.defaultChild as cdk.CfnResource;
                //cfnResource.addOverride('Properties.Runtime', 'nodejs10.x');
            }
        });
        */
        
        /*
        getParameter.node.children.forEach(child => {
            console.log("?");
            console.log(child.toString());
            const cfnResource = child as cdk.CfnResource;
            console.log(cfnResource.cfnResourceType)
            if (cfnResource.cfnResourceType === "AWS::Lambda::Function") {
                console.log("!");
                //const cfnResource = child.node.defaultChild as cdk.CfnResource;
                //cfnResource.addOverride('Properties.Runtime', 'nodejs10.x');
            }
        });
        */
        
        //const cfnFn = provider.node.defaultChild as lambda.CfnFunction; 

        //cfnFn.addPropertyOverride("Runtime", "nodejs10.x");
        
        cdk.Aspects.of(this).add(new LambdaVpcChecker());
    };
};

class Lambdahecker1 implements cdk.IAspect {
    public visit(node: cdk.IConstruct): void {
        if (node instanceof lambda.CfnFunction) {
            if (node.runtime) {
                node.addPropertyOverride('666666666', 'nodejs9.x');
            }
        }
    }
};

class Lambdahecker2 implements cdk.IAspect {
    public visit(node: cdk.IConstruct): void {
        if (node instanceof cdk.CfnResource) {
            if (node.cfnResourceType === 'AWS::Lambda::Function') {
                node.addPropertyOverride('Runtimey', 'nodejs9.x');
            }
        }
    }
};

class LambdaVpcChecker implements cdk.IAspect {
    public visit(node: cdk.IConstruct): void {
        if (node instanceof lambda.CfnFunction) {
            if (!node.vpcConfig) {
              node.vpcConfig = {
                securityGroupIds: ["sg-085912345678492fb"],
                subnetIds: ["subnet-071f712345678e7c8", "subnet-07fd123456788a036"]
              }
            }
        }
    }
};