# Repository Manager

This manages the repos, teams and members of the cdk.dev Github organization. Manual changes will be overwritten.

This uses [Terraform CDK](https://cdk.tf) and the prebuilt [Github Provider](https://cdk.tf/provider/github). The Terraform state is kept in the [Terraform Cloud](https://terraform.io/) and it's gonna be deployed via Github Actions (not yet implemented).
