"use strict";

require("dotenv").config();
const axios = require("axios");

const USERNAME = "alestrunda";
const EVENTS_HISTORY_AGO_MONTHS = 2;

// github api returns up to 300 results
const ITEMS_PER_PAGE = 60;
const MAX_PAGE = 5;

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
      // filter commits that are not older then some date (github api returns this activity from up to 90 days ago)
      const commits_date = new Date();
      commits_date.setMonth(
        commits_date.getMonth() - EVENTS_HISTORY_AGO_MONTHS
      );
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

const getEvents = (page) =>
  axios
    .get(
      `https://api.github.com/users/${USERNAME}/events?page=${page}&per_page=${ITEMS_PER_PAGE}`,
      {
        headers: {
          Authorization: `token ${process.env.TOKEN}`,
        },
      }
    )
    .then((res) => res.data);

const getCommitsSince = async (date) => {
  let commits = [];
  for (let page = 1; page <= MAX_PAGE; page++) {
    const events = await getEvents(page);
    const all_commits = events.filter(isCommit);
    const latest_commits = filterCommitsSince(all_commits, date);
    if (!latest_commits.length) break;
    commits = commits.concat(latest_commits);
  }
  return commits;
};

const filterCommitsSince = (commits, date) =>
  commits.filter((commit) => date <= new Date(commit.created_at));

const isCommit = (event) => event.type === "PushEvent";
