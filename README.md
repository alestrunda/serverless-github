# Serverless GitHub API

Simple API to return some stats about a GitHub user.

## Get started

Set up your GitHub access token in `.env` file as `TOKEN=your-github-token` and in file `handle.js` change the `USERNAME` to the user whose statistics you want to get (must be associated with the token). You do not necessary need the token, but that would get the stats only from public repos.

Deploy it using `serverless deploy`. Can be deployed for example on AWS.

## Usage

- `/commits` number of recent commits (both public and private)
- `/repos` number of repos (both public and private)

## Development

### ``serverless offline``

Runs local server with all the functions.

### ``serverless invoke -f &lt;function-name&gt;``

Runs a single function locally, for example `getCommitsCnt`.

## Deploy

`serverless deploy` deploys functions to the service provider.
