# FDC3 Pages Layout

This repo contains the configuration to apply to any FDC3 repository that wants to publish documentation using GitHub Pages.

Follow the steps below to configure your repository accordingly.

## GitHub authentication

In order to configure Travis CI to push changes to GitHub, it is necessary to collect:
1. `GITHUB_USERNAME`, a GitHub username with write access to your FDC3 repository (specifically, the `gh-pages` branch)
2. `GITHUB_EMAIL`, an email address related to the the GitHub username specified on #1
3. `GITHUB_TOKEN`, a GitHub [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/); it needs to have `public_repo` permissions.

## Enable Travis CI

Travis CI must be configured with the instructions needed to generate and publish the documentation site.

1. Please email help@finos.org with subject `Enable Travis CI for project github.com/fdc3/<repo name>` and we'll enable the CI environment for you.
2. Install the [travis commandline client](https://github.com/travis-ci/travis.rb) and generate the encrypted versions of your GitHub username, email and access token, using the following commands:
```
travis encrypt GITHUB_TOKEN=....
travis encrypt GITHUB_USERNAME=....
travis encrypt GITHUB_PASSWORD=....
```
3. Paste the `- secure` items in your `.travis.yml`, along with the content in [travis.sample.yml](travis.sample.yml).

## Integrate docs publishing in Travis CI

All the following block in `.travis.yml`:
```
  - provider: script
    skip_cleanup: true
    script: curl https://raw.githubusercontent.com/fdc3/FDC3/master/docs/prepare-docs-release.sh | bash
    on:
      branch: branch
```

## Using a custom domain

You can specify the custom domain you want to use for the documentation site publishing by defining a `docs/CNAME` file with the name of the domain, ie `fdc3-api.finos.org`.

Checkout [GitHub Pages documentation](https://help.github.com/articles/setting-up-an-apex-domain/) to edit DNS configurations accordingly.

## Run website locally
To run the website documentation locally, please follow the steps below.

### Install Ruby (MacOS)

It is strongly advised to use RVM or RBenv to install Ruby; below are the steps to install RVM on MacOS.
```
mkdir -p ~/.rvm/src && cd ~/.rvm/src && rm -rf ./rvm && \
git clone --depth 1 https://github.com/rvm/rvm.git && \
cd rvm && ./install
rvm install 2.5.2
which bundle #Should return a .rvm sub-path
which ruby #Should return a .rvm sub-path
```

### Install gems needed for jekyll

```
cd /tmp
git clone https://github.com/pages-themes/slate
cd slate
rm -rf .bundle
./script/bootstrap
gem install jekyll-theme-slate
gem install jekyll-seo-tag
gem install jekyll-watch
```

# Run jekyll on other project
```
cd ../API/docs
jekyll serve --incremental
```