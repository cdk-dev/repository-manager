import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Repository, RepositoryConfig } from 'cdktf-github-constructs';
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
  }

  public mainRepos() {
    const { collaborators } = this.teams.resources

    const base = new Repository(this, 'base', {
      ...this.defaultRepositoryOptions,
      description: 'Repo for organizing things around cdk.dev'
    })

    const website = new Repository(this, 'website', {
      ...this.defaultRepositoryOptions,
      description: 'Website for cdk.dev'
    })

    website.addTeam(collaborators, Repository.Permissions.PUSH)

    const repositoryManager = new Repository(this, 'repository-manager', {
      ...this.defaultRepositoryOptions,
      description: 'Manage repositories within this organization with Terraform CDK',
      topics: ['cdk', 'terraform-cdk', 'cdktf']
    })

    this.repositories.push(
      base,
      website,
      repositoryManager
    )
  }

  private get defaultRepositoryOptions(): RepositoryConfig {
    return {
      homepageUrl: 'https://cdk.dev',
      hasIssues: true,
      hasWiki: false,
      hasProjects: false,
      deleteBranchOnMerge: true,
      allowMergeCommit: true,
      allowRebaseMerge: true,
      allowSquashMerge: true,
      topics: ['cdk', 'aws-cdk', 'terraform-cdk', 'cdktf', 'cdk8s', 'constructs', 'jsii']
    }
  }
}
