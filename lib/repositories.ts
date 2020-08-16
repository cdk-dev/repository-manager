import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Repository, RepositoryPermissions } from './constructs/repository';
import { Teams } from './teams';

export interface RepositoriesConfig {
  teams: Teams
}

export class Repositories extends Resource {
  public readonly repositories: Repository[];

  constructor(scope: Construct, name: string, config: RepositoriesConfig) {
    super(scope, name);

    const { collaborators } = config.teams.resources

    const base = new Repository(this, 'base', {
      description: 'Repo for organizing things around cdk.dev'
    })

    const website = new Repository(this, 'website', {
      description: 'Website for cdk.dev'
    })

    new Repository(this, 'foobarbaz', {
      description: 'test'
    })

    website.addTeam(collaborators, RepositoryPermissions.PUSH)

    const repositoryManager = new Repository(this, 'repository-manager', {
      description: 'Manage repositories within this organization with Terraform CDK',
      topics: ['cdk', 'terraform-cdk', 'cdktf']
    })

    this.repositories = [
      base,
      website,
      repositoryManager
    ]
  }
}
