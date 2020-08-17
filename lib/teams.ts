import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Team } from './index';

export interface CdkDevTeams {
  collaborators: Team
  tools: Team
}

export class Teams extends Resource {
  public readonly resources: CdkDevTeams;

  constructor(scope: Construct, name: string) {
    super(scope, name);

    this.resources = {
      collaborators: new Team(this, 'collaborators'),
      tools: new Team(this, 'tools')
    }
  }
}
