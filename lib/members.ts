import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import { Teams } from './teams';
import { Member } from './constructs/member';

export interface MembersConfig {
  teams: Teams
}

export class Members extends Resource {
  public readonly members: Member[];

  constructor(scope: Construct, name: string, config: MembersConfig) {
    super(scope, name);

    const { collaborators } = config.teams.resources

    this.members = [
      new Member(this, 'skorfmann', {
        isOwner: true,
        teams: [
          collaborators
        ]
      })
    ]
  }
}
