# Serverless GitHub API

Simple API to return statictics about GitHub user.

Set up your GitHub access token in .env file as `TOKEN=your-github-token` and in file `handle.js` change the `USERNAME` to the user whose statistics you want to get (must be associated with the token).

Deploy it using `serverless deploy`. Can be deployed for example on AWS.

## Usage

- `/commits` number of recent commits
- `/repos` number of repos (both public and private)
