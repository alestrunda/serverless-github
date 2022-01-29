"use strict";

require("dotenv").config();
const axios = require("axios");

const USERNAME = "alestrunda";
const MAX_PAGE = 10;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

module.exports = {
  getReposCnt: async () => {
    try {
      const repos_cnt = await getReposCnt();
      return {
        statusCode: 200,
        body: JSON.stringify({
          repos_cnt,
        }),
        headers,
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: e.message,
        }),
        headers,
      };
    }
  },
  getCommitsCnt: async () => {
    try {
      //commits that are not older than 3 month (github api returns this activity from up to 90 days ago)
      const commits_date = new Date();
      commits_date.setMonth(commits_date.getMonth() - 3);
      const commits = await getCommitsSince(commits_date);
      return {
        statusCode: 200,
        body: JSON.stringify({
          commits_cnt: commits.length,
        }),
        headers,
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: e.message,
        }),
        headers,
      };
    }
  },
};

const getRepos = (page) =>
  axios
    .get(
      `https://api.github.com/user/repos?page=${page}&per_page=${ITEMS_PER_PAGE}&type=owner`,
      {
        headers: {
          Authorization: `token ${process.env.TOKEN}`,
        },
      }
    )
    .then((res) => res.data);

const getReposCnt = async () => {
  let total = 0;
  for (let page = 1; page <= MAX_PAGE; page++) {
    const repos_cnt = (await getRepos(page)).length;
    if (!repos_cnt) break;
    total += repos_cnt;
  }
  return total;
};

const getCommits = (page) =>
  axios
    .get(`https://api.github.com/users/${USERNAME}/events?page=${page}`, {
      headers: {
        Authorization: `token ${process.env.TOKEN}`,
      },
    })
    .then((res) => res.data);

const getCommitsSince = async (date) => {
  let commits = [];
  for (let page = 1; page <= MAX_PAGE; page++) {
    const current_commits = await getCommits(page);
    if (!current_commits.length) break;
    const commits_since = filterCommitsSince(current_commits, date);
    if (!commits_since.length) break;
    commits = commits.concat(commits_since);
  }
  return commits;
};

const filterCommitsSince = (commits, date) =>
  commits.filter((commit) => date <= new Date(commit.created_at));
