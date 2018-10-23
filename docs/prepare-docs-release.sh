#!/bin/bash

THEME_GIT_REPO="https://github.com/maoo/fdc3-pages-layout.git"

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[:space:]')

GH_REPO_LINE=$(cat package.json | grep repository)
GH_REPO=$(echo ${GH_REPO_LINE#*:} | sed 's/[",]//g' | tr -d '[:space:]')

# Copying images in docs/ folder and patching release version
cp -Rf images/ docs/
sed -i "s/\[\[tag\]\]/$PACKAGE_VERSION/g" docs/_config.yml
echo "---\nflag: tags\n---" > ${PACKAGE_VERSION}.md
echo "Updated _config.yml folder with version '$PACKAGE_VERSION'"

# Pulling theme layout and assets
git clone $THEME_GIT_REPO /tmp/theme-repo
cp -rf /tmp/theme-repo/docs/theme/{_layouts,assets} docs/
echo "Copied common _layouts and assets folders into docs/"

# Pulling contents from gh-pages branch
git clone $GH_REPO gh-pages-docs
cd gh-pages-docs
git checkout gh-pages
rm -rf .git
cd ..
cp -f gh-pages-docs/CHANGELOG.md docs/
echo "Cloned gh-pages branch"

# Append new release notes at the top of CHANGELOG.md
# Check package.json to see how CHANGELOG.md.new is created
echo -e "$(cat docs/CHANGELOG.md.new)\n\n$(cat docs/CHANGELOG.md)" > docs/CHANGELOG.md
rm -f docs/CHANGELOG.md.new
echo "Updated docs/CHANGELOG.md"

# Copy docs/ contents in a tag-specific subfolder, to allow access to docs history
# Tags are configured as Jekyll collections in _config.yml
mkdir -p gh-pages-docs/tags/$PACKAGE_VERSION
cp -rf docs/* gh-pages-docs/tags/$PACKAGE_VERSION

# Updating gh-pages branch root folder
cp -rf docs/* gh-pages-docs/

echo "Updated _config.yml folder with version '$PACKAGE_VERSION'"