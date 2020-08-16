import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Team } from './index';

export interface CdkDevTeams {
  collaborators: Team
}

export class Teams extends Resource {
  public readonly resources: CdkDevTeams;

  constructor(scope: Construct, name: string) {
    super(scope, name);

    this.resources = {
      collaborators: new Team(this, 'collaborators')
    }
  }
}
