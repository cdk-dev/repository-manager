import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Repository, RepositoryPermissions } from './constructs/repository';
import { Teams } from './teams';

export interface RepositoriesConfig {
  teams: Teams
}

export class Repositories extends Resource {
  public readonly repositories: Repository[] = [];
  public readonly teams: Teams

  constructor(scope: Construct, name: string, config: RepositoriesConfig) {
    super(scope, name);
    this.teams = config.teams

    this.mainRepos()
    this.toolRepos()
  }

  public mainRepos() {
    const { collaborators } = this.teams.resources

    const base = new Repository(this, 'base', {
      description: 'Repo for organizing things around cdk.dev'
    })

    const website = new Repository(this, 'website', {
      description: 'Website for cdk.dev'
    })

    website.addTeam(collaborators, RepositoryPermissions.PUSH)

    const repositoryManager = new Repository(this, 'repository-manager', {
      description: 'Manage repositories within this organization with Terraform CDK',
      topics: ['cdk', 'terraform-cdk', 'cdktf']
    })

    this.repositories.push(
      base,
      website,
      repositoryManager
    )
  }

  public toolRepos() {
    const { tools } = this.teams.resources

    const createCdkApp = new Repository(this, 'create-cdk-app', {
      description: 'Create CDK Apps from Templates',
      topics: ['cdk', 'create-app', 'aws', 'templates', 'aws-cdk']
    })

    const bumpCdkAction = new Repository(this, 'bump-cdk-action', {
      description: 'GitHub Action for automating cdk version management',
      topics: ['cdk', 'aws-cdk', 'github-actions', 'github', 'actions']
    })

    const bumpCdk = new Repository(this, 'bump-cdk', {
      description: 'Easily manage AWS CDK Dependencies',
      topics: ['aws', 'aws-cdk', 'version-management', 'cli', 'tool']
    })

    createCdkApp.addTeam(tools, RepositoryPermissions.ADMIN)
    bumpCdkAction.addTeam(tools, RepositoryPermissions.ADMIN)
    bumpCdk.addTeam(tools, RepositoryPermissions.ADMIN)

    this.repositories.push(
      createCdkApp,
      bumpCdk,
      bumpCdkAction
    )
  }
}
