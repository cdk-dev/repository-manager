import { Construct } from 'constructs';
import { Resource } from 'cdktf';
import * as Github from '@cdktf/provider-github'
import { Team } from './team'

interface MemberConfig {
  readonly teams: Team[];
  readonly isOwner: boolean;
}

export class Member extends Resource {
  public readonly name: string;

  constructor(scope: Construct, name: string, config: MemberConfig) {
    super(scope, name);

    this.name = name;

    const { isOwner = false, teams } = config;

    if (!isOwner) {
      new Github.Membership(this, 'membership', {
        username: name,
        role: 'member'
      })
    }

    teams.forEach((team) => team.addMember(this))
  }
}
