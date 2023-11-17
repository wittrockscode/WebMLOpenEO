# R Backend
## How to work on the R Backend
The R Backend is managed as a "git submodule". Here we use the repository "MichaelBrueggemann/openeocubes". When working on this submodule, please consider the following:

- always check out to the "main" branch before making changes (e.g. creating a new branch to work on). Use `git checkout main` if you are on a "detached HEAD" Branch. Then use `git pull` to pull the latest changes to the submodule. 
You can check this by using `git branch`
- always make sure to commit and push all changes before pushing anything on the main repository ("WebMLOpenEO).