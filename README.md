# Repository Manager

This manages the repos, teams and members of the cdk.dev Github organization. Manual changes will be overwritten.

This uses [Terraform CDK](https://cdk.tf) and the prebuilt [Github Provider](https://cdk.tf/provider/github). The Terraform state is kept in the [Terraform Cloud](https://terraform.io/) and it's gonna be deployed via Github Actions (not yet implemented).

## Usage

Make sure you have a `GITHUB_TOKEN` set in your env. You'll also have to [have access](https://github.com/hashicorp/terraform-cdk/blob/master/docs/working-with-cdk-for-terraform/remote-backend.md) to the `cdk-dev` Terraform Cloud organization.

```
yarn install
cdktf diff / deploy
```