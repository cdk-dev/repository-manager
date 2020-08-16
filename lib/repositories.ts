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

    const baseRepo = new Repository(this, 'base', {
      description: 'Repo for organizing things around cdk.dev'
    })

    const websiteRepo = new Repository(this, 'website', {
      description: 'Website for cdk.dev'
    })

    websiteRepo.addTeam(collaborators, RepositoryPermissions.PUSH)

    const repositoryManagerRepo = new Repository(this, 'repository-manager', {
      description: 'Manage repositories within this organization with Terraform CDK',
      topics: ['cdk', 'terraform-cdk', 'cdktf']
    })

    this.repositories = [
      baseRepo,
      websiteRepo,
      repositoryManagerRepo
    ]
  }
}
