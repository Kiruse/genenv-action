# genenv-action
Generate a .env file from GitHub Workflows.

This is useful to generate .env files containing secrets for further deployment or use in other applications during the deployment pipeline. Make sure to not commit this file in the same workflow.

I discourage using this Action unless necessary. For our usecase, for example, we generate this .env using values stored in GitHub Secrets which are then uploaded to third-party key vaults.

## Example Usage
```yaml
env:
  API_URL: foobar

jobs:
  build:
    name: Build Project
    runs-on: ubuntu-latest
    steps:
    - name: Generate .env
      uses: kiruse/genenv-action@v0
      with:
        clone: API_URL
        env: |
          FOO = bar
          BAR = foo
          SOME_VAR = ${{ vars.SOME_VAR }}
          SOME_SECRET = ${{ secrets.SOME_SECRET }}
        require: FOO, SOME_SECRET
```
This will produce a virtual .env file which only exists for the remainder of this job.

## Inputs
