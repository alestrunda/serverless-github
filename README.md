# Serverless GitHub API

Simple API to return some stats about a GitHub user.

## Get started

Install serverless globally: `npm install -g serverless`.

Set up your GitHub access token in `.env` file based on `.env.sample`. Github token can be generated in [github settings](https://github.com/settings/tokens)). Thanks to the token you will get stats also for your private repos.

In file `handle.js` change the `USERNAME` to the user whose statistics you want to get (must be associated with the token). You do not necessary need the token, but that would get the stats only from public repos.

## Usage

- `/commits` number of recent commits (both public and private)
- `/repos` number of repos (both public and private)

## Development

### `serverless offline`

Runs local server with all the functions.

### `serverless invoke -f &lt;function-name&gt;`

(if you haven't deployed any function yet, run the `deploy` command first)

Triggers a single function which was deployed to the provider, for example `serverless invoke -f getCommitsCnt`.

## Deploy

**AWS** is used in this case, but you can change that in the `serverless.yml` file - `provider > name`.

### Set up credentials

[More information here](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

There are more ways, I'm using `aws-cli` - [install it](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html), then run `aws configure` to set the credentials, then you can deploy.

### Deploy command

`serverless deploy` deploys all functions to AWS.

If you have multiple AWS profiles, you can specify under which to deploy - `serverless deploy --aws-profile devProfile`.

Don't forget to also set `env` variables in AWS.
