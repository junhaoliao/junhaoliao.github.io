---
title: "Import an Existing Git Repository onto GitHub"
date: "2021-04-09"
description: "A guide to import Git repositories stored on school servers onto GitHub, with tips for fixing common issues."
tags: ["tutorial", "git", "github", "ece297"]
---

## Background

This guide should be particularly useful for importing the Git repositories created and stored on school servers onto GitHub.

## Steps

1. Create a new (private) repository on GitHub. GitHub should give you a link in the following format:

```
https://github.com/userName/ece297example.git
```

2. Now go into your already created Git repository to add the GitHub repo as a "remote" of your git repo:

```
git remote add github https://github.com/userName/ece297example.git
```

3. Push to the GitHub repo:

```
git push github master
```

## Common Issues

**Q: It will be an Academic Offence if someone copies my code. However, the GitHub repo was mistakenly created as a public one. Now that I have uploaded my code to the GitHub repo. How do I change the GitHub repo's visibility?**

A: You may follow the steps below to change the visibility of your GitHub repo:

1. Open the GitHub repo in your browser and go to "Settings"

![Where to find "Settings" of a GitHub repository](/images/blog/import-git-repo-onto-github/github-settings.webp)

2. Under "Options", scroll to the bottom of the page and you will be able to find the option to change the visibility of the repo.

![Where to find "Change Visibility" of a GitHub repository](/images/blog/import-git-repo-onto-github/github-visibility.webp)

**Q: When pushing to the GitHub repository, the push was rejected because the GitHub repo doesn't accept any single file that is greater than 100M. However, the file has already been deleted in some commit, what should I do?**

A: Once you committed some file to a git repo, it will be in the git history "forever" so that whenever you accidentally delete the file, you will still be able to recover it. To permanently delete the files greater than 100M from your repo, you may follow these steps:

```
# download the BFG tool into ~/Downloads
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar --directory-prefix=$HOME/Downloads

# check your group number and replace cd-000 below
groups

# make a clone of your repository because everything we do below could be VERY dangerous
cd ~
git clone --mirror ug251.eecg.utoronto.ca:/groups/ECE297S/cd-000/mapper_repo

# use BFG to remove the big file from the bare git repo
java -jar ~/Downloads/bfg-1.14.0.jar --strip-blobs-bigger-than 100M mapper_repo.git

# prune the git repo
cd mapper_repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# set the "origin" remote to the github url and push
git remote set-url origin https://github.com/userName/ece297example.git
git push
```
