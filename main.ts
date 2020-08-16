import { Construct } from 'constructs';
import { App, TerraformStack, RemoteBackend } from 'cdktf';
import { GithubProvider } from '@cdktf/provider-github'
import { Repositories, Members } from './lib'
import { Teams } from './lib/teams';

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

    const teams = new Teams(this, 'teams')
    new Repositories(this, 'repositories', { teams })
    new Members(this, 'members', { teams })
  }
}

const app = new App();
new MyStack(app, 'repository-manager');
app.synth();
