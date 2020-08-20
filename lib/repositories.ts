import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Repository, RepositoryConfig } from 'cdktf-github-constructs';
import { Teams } from './teams';
import { BranchProtection } from '@cdktf/provider-github'
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
      ...this.defaultRepositoryOptions,
      description: 'Repo for organizing things around cdk.dev'
    })

    const website = new Repository(this, 'website', {
      ...this.defaultRepositoryOptions,
      description: 'Website for cdk.dev'
    })

    website.addTeam(collaborators, Repository.Permissions.PUSH)

    new BranchProtection(this, 'website-protection', {
      repository: website.name,
      branch: 'master',
      requiredPullRequestReviews: [{
        requiredApprovingReviewCount: 1
      }]
    })

    const repositoryManager = new Repository(this, 'repository-manager', {
      ...this.defaultRepositoryOptions,
      description: 'Manage repositories within this organization with Terraform CDK',
      topics: ['cdk', 'terraform-cdk', 'cdktf']
    })

    new BranchProtection(this, 'respository-manager-protection', {
      repository: repositoryManager.name,
      branch: 'master'
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

  public toolRepos() {
    const { tools } = this.teams.resources

    const createCdkApp = new Repository(this, 'create-cdk-app', {
      ...this.defaultRepositoryOptions,
      description: 'Create CDK Apps from Templates',
      topics: ['cdk', 'create-app', 'aws', 'templates', 'aws-cdk']
    })

    const bumpCdkAction = new Repository(this, 'bump-cdk-action', {
      ...this.defaultRepositoryOptions,
      description: 'GitHub Action for automating cdk version management',
      topics: ['cdk', 'aws-cdk', 'github-actions', 'github', 'actions']
    })

    const bumpCdk = new Repository(this, 'bump-cdk', {
      ...this.defaultRepositoryOptions,
      description: 'Easily manage AWS CDK Dependencies',
      topics: ['aws', 'aws-cdk', 'version-management', 'cli', 'tool']
    })

    createCdkApp.addTeam(tools, Repository.Permissions.ADMIN)
    bumpCdkAction.addTeam(tools, Repository.Permissions.ADMIN)
    bumpCdk.addTeam(tools, Repository.Permissions.ADMIN)

    this.repositories.push(
      createCdkApp,
      bumpCdk,
      bumpCdkAction
    )
  }
}
