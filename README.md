# RSS Entries Fetch Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Introduction

The RSS Entries Fetch Action is a GitHub Action created to make easier taking articles from any RSS feed.

Strongly inspired on [RSS Fetch Action](https://github.com/Promptly-Technologies-LLC/rss-fetch-action) which fetches the
feeds but not the articles inside them.

This GitHub Action is a wrapper around
the extract function from both [@extractus/feed-extractor](https://github.com/@extractus/feed-extractor)
and [@extractus/article-extractor](https://github.com/extractus/article-extractor) libraries.

Both extract methods here are called with their defaults. Any addition or change is welcome, send your own PR and let's
merge it ;)

## Features

- Fetches RSS, Atom, RDF, and JSON feeds and their articles.
- Saves the fetched articles inside the specified destination folder.

## Usage

Here's a basic example to add to your GitHub Actions workflow YAML file:

```yaml
name: Fetch RSS Articles

on:
  push:
    branches:
      - main

jobs:
  fetch-rss:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Fetch RSS Articles
        uses: nahuelhds/rss-fetch-action@v0
        with:
          feed_urls: https://rss.nytimes.com/services/xml/rss/nyt/World.xml
          destination_folder: ./test

      - name: Commit and push changes to repository
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Update RSS articles'
```

In this workflow, we fetch the [New York Times RSS](https://rss.nytimes.com/services/xml/rss/nyt/World.xml) feed and save all the
articles on the `./test` folder. We then commit and push the changes to the repository.

## nahuelhds

- [Twitter](https://twitter.com/nahuelhds)
- [Instagram](https://instagram.com/nahuelhds)
- [Dev.to](https://dev.to/nahuelhds)
- [Medium](http://medium.com/@nahuelhds)
