# WebMLOpenEO

## Working with the "openEOcubes" Backend
In this project we incorporated the git-Repo "openeocubes" as a "git submodule". This means some extra steps have to be taken, when working this repository:

### Cloning
- clone this repo with `git clone --recurse-submodules <link-to-this-repo>`

### Pushing
- When working on this repository you always have to make sure every local change in the "openeocubes" submodule is pushed to the upstream. To ensure this run `git push --recurse-submodules=check` in this repository. This ensures that changes to this repo can't be pushed until the submodule is pushed.
    - when you dont want to type this everytime, you can change "git push" with `git config push.recurseSubmodules check`

### Pulling
- When you pull changes from this repo, use `git submodule update --init --recursive` after using `git pull`. This makes sure, that also changes in the submodule are pulled
    - when you dont want to type this everytime, you can change "git push" with `git config submodule.recurse`. This makes git use `git submodule update --init --recursive` after using `git pull`.

When working in the submodule "openeocubes" the git workflow acts as normal and no extra commands have to be used.


**Tips**: 
- use `git config status.submodulesummary 1`. With this your "git status" output will also contain a small summary of whats changed in the submodule.
