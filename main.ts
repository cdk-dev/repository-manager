import { Construct } from 'constructs';
import { App, TerraformStack, RemoteBackend } from 'cdktf';
import { GithubProvider, Repository } from '@cdktf/provider-github'

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: 'cdk-dev',
      workspaces: {
        name: 'repository-manager'
      }
    })

    new GithubProvider(this, 'cdk-dev', {
      token: process.env.GITHUB_TOKEN,
      organization: 'cdk-dev'
    })

    const topics = ['cdk', 'aws-cdk', 'terraform-cdk', 'cdktf', 'cdk8s', 'constructs', 'jsii']

    new Repository(this, 'base', {
      name: 'base',
      description: 'Repo for organizing things around cdk.dev',
      homepageUrl: 'https://cdk.dev',
      hasIssues: true,
      hasWiki: false,
      hasProjects: false,
      deleteBranchOnMerge: true,
      topics
    })

    new Repository(this, 'website', {
      name: 'website',
      description: 'Website for cdk.dev',
      homepageUrl: 'https://cdk.dev',
      hasIssues: true,
      hasWiki: false,
      hasProjects: false,
      deleteBranchOnMerge: true,
      topics
    })

    new Repository(this, 'repository-manager', {
      name: 'repository-manager',
      description: 'Manage repositories within this organization with Terraform CDK',
      homepageUrl: 'https://cdk.dev',
      hasIssues: true,
      hasWiki: false,
      hasProjects: false,
      deleteBranchOnMerge: true,
      topics: ['cdk', 'terraform-cdk', 'cdktf']
    })
  }
}

const app = new App();
new MyStack(app, 'repository-manager');
app.synth();
