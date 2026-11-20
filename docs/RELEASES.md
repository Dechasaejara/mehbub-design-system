# Release process

1. Create a feature branch.
2. Make the change and tests.
3. Add a Changeset for every publishable package affected.
4. Open a pull request; CI builds and tests.
5. Merge after review.
6. Changesets opens/updates a version PR.
7. Review semver impact and changelog.
8. Merge the version PR to publish packages.
9. Client apps upgrade explicitly and test before deployment.

Do not use broad automatic dependency updates in client production branches.
