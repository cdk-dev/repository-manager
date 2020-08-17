import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import * as Github from '@cdktf/provider-github'
import { Team } from './team';

export interface RepositoryConfig {
  readonly description: string;
  readonly topics?: string[]
}

export enum RepositoryPermissions {
  PULL = 'pull',
  TRIAGE = 'triage',
  PUSH = 'push',
  MAINTAIN = 'maintain',
  ADMIN = 'admin'
}

export class Repository extends Resource {
  public readonly name: string;
  public readonly resource: Github.Repository;

  constructor(scope: Construct, name: string, config: RepositoryConfig) {
    super(scope, name);

    this.name = name;
    const { description, topics = ['cdk', 'aws-cdk', 'terraform-cdk', 'cdktf', 'cdk8s', 'constructs', 'jsii'] } = config;

    const defaultRepositoryOptions: Github.RepositoryConfig = {
      name: 'placeholder',
      homepageUrl: 'https://cdk.dev',
      hasIssues: true,
      hasWiki: false,
      hasProjects: false,
      deleteBranchOnMerge: true,
      allowMergeCommit: true,
      allowRebaseMerge: true,
      allowSquashMerge: true,
      topics
    }

    this.resource = new Github.Repository(this, 'repository', {
      ...defaultRepositoryOptions,
      name,
      description,
      lifecycle: { // there seems to be an issue in github actions with these attributes, they're assumed to be false all the time.
        ignoreChanges: ['deleteBranchOnMerge', 'allowMergeCommit', 'allowRebaseMerge', 'allowSquashMerge']
      }
    })
  }

  public addTeam(team: Team, permission: RepositoryPermissions): void {
    new Github.TeamRepository(this, `team-${team.resource.id}`, {
      teamId: team.resource.id!,
      repository: this.name,
      permission
    })
  }
}
