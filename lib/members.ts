import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Teams } from './teams';
import { Member } from 'cdktf-github-constructs';

export interface MembersConfig {
  teams: Teams
}

export class Members extends Resource {
  public readonly members: Member[];

  constructor(scope: Construct, name: string, config: MembersConfig) {
    super(scope, name);

    const { tools } = config.teams.resources

    this.members = [
      new Member(this, 'wulfmann', {
        teams: [
          tools
        ]
      })
    ]
  }
}
