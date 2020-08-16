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

    const defaultRepositoryOptions = {
      homepageUrl: 'https://cdk.dev',
      hasIssues: true,
      hasWiki: false,
      hasProjects: false,
      deleteBranchOnMerge: true,
      topics
    }

    this.resource = new Github.Repository(this, 'repository', {
      ...defaultRepositoryOptions,
      name,
      description
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