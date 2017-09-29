# Prefect

This is the github campus expert prefect, it is responsible for helping to maintain our public and private repositories.

## Reactions

Prefect reacts to a number of GitHub events via the GitHub API. Below is a list of reactions prefect performs.

* Template Enforcer - Checks issues and pull requests for template compliancy, if a new issue or PR is created which is not complaint with the template, it will prompt the creator to correct the problem.

## Developing

Prefect is built using the [Probot]() framework, you will need some understanding of the [Probot API]().

Prefect contains three main directories.

## Scripts

Contains all the probot specific code, this is primarily listening for webhooks and making the final response.

## Shared

Holds all non-probot specific code which can be shared across all the probot scripts.

## Tests

Contains all unit tests for the Shared code.