This website was created with [Docusaurus](https://docusaurus.io/).

# What's In This Document

* [Get Started in 5 Minutes](#get-started-in-5-minutes)
* [Directory Structure](#directory-structure)
* [Editing Content](#editing-content)
* [Adding Content](#adding-content)
* [Full Documentation](#full-documentation)

# Get Started in 5 Minutes

1. Make sure all the dependencies for the website are installed:

```sh
# Install dependencies
$ yarn
```
2. Run your dev server:

```sh
# Start the site
$ yarn start
```

## Directory Structure

Your project file structure should look something like this

```
my-docusaurus/
  docs/
    doc-1.md
    doc-2.md
    doc-3.md
  website/
    blog/
      2016-3-11-oldest-post.md
      2017-10-24-newest-post.md
    core/
    node_modules/
    pages/
    static/
      css/
      img/
    package.json
    sidebar.json
    siteConfig.js
```

# Versioning

Docusaurus uses the `docusaurus-version` command to create a snapshot of the documents in the `docs` folder with a particular version number, 
and places them in the `versioned_docs/version-<version>` folder. It also creates a `versioned_sidebars/version-<version>-sidebars.json` 
to save the navigation structure at the time the snapshot was taken. 

See https://docusaurus.io/docs/en/versioning for more info.

## Versioning scheme

Since FDC3 is a schema project, we don't follow semver, which is meant for libraries. We use the versioning scheme `<major>.<minor>`, e.g. `1.1` or `2.3`.

## Create a new version

Since the website also uses some generated and copied static files (like schemas), extra tasks need to be performed as part of creating
a new version.

To create a new version, use this command:
```sh
VERSION=<version> yarn run version
```
e.g.
```sh
VERSION=1.2 yarn run version
```

The `VERSION` environment variable and `version` script are used to:
- Run the `docusaurus-version` command
- Copy schemas from the `/website/static/schemas/next` (which matches `master`) to `/website/static/schemas/<version>`
- Copy the app-directory OpenAPI html file from `/website/pages/schemas/next` to `/website/pages/schemas/<version>`
- Update paths referring to `/schemas/next` to point to `/schemas/<version>`
- Update the version number in the app directory schema from `version: next` to `version: <version>`

After a new version is created with the script, the following step also needs to be performed:
1. Change `defaultVersionShown` in `siteConfig.js` to match the latest version (if the new version is now the latest version).
2. Change `versions.json` to have the version `stable` at the top, followed by the actual version numbers in descending order, e.g. `[stable, 1.3, 1.2, 1.1]`. (Docusaurus will add the new version number at the top of the array.)

These steps are needed because we follow a workaround for an [issue with permanenent versioned URLs](https://github.com/facebook/docusaurus/issues/1312).

## Delete a version

To delete a version, use this command:
```sh
VERSION=<version> yarn run version:delete
```
e.g.
```sh
VERSION=1.2 yarn run version:delete
```

This will delete all docusaurus and other version-specific folders for the specified version.

# Editing Content

## Editing an existing docs page

Edit docs by navigating to `docs/` and editing the corresponding document:

`docs/doc-to-be-edited.md`

```markdown
---
id: page-needs-edit
title: This Doc Needs To Be Edited
---

Edit me...
```

For more information about docs, click [here](https://docusaurus.io/docs/en/navigation)

## Editing an existing blog post

Edit blog posts by navigating to `website/blog` and editing the corresponding post:

`website/blog/post-to-be-edited.md`
```markdown
---
id: post-needs-edit
title: This Blog Post Needs To Be Edited
---

Edit me...
```

For more information about blog posts, click [here](https://docusaurus.io/docs/en/adding-blog)

# Adding Content

## Adding a new docs page to an existing sidebar

1. Create the doc as a new markdown file in `/docs`, example `docs/newly-created-doc.md`:

```md
---
id: newly-created-doc
title: This Doc Needs To Be Edited
---

My new content here..
```

1. Refer to that doc's ID in an existing sidebar in `website/sidebar.json`:

```javascript
// Add newly-created-doc to the Getting Started category of docs
{
  "docs": {
    "Getting Started": [
      "quick-start",
      "newly-created-doc" // new doc here
    ],
    ...
  },
  ...
}
```

For more information about adding new docs, click [here](https://docusaurus.io/docs/en/navigation)

## Adding a new blog post

1. Make sure there is a header link to your blog in `website/siteConfig.js`:

`website/siteConfig.js`
```javascript
headerLinks: [
    ...
    { blog: true, label: 'Blog' },
    ...
]
```

2. Create the blog post with the format `YYYY-MM-DD-My-Blog-Post-Title.md` in `website/blog`:

`website/blog/2018-05-21-New-Blog-Post.md`

```markdown
---
author: Frank Li
authorURL: https://twitter.com/foobarbaz
authorFBID: 503283835
title: New Blog Post
---

Lorem Ipsum...
```

For more information about blog posts, click [here](https://docusaurus.io/docs/en/adding-blog)

## Adding items to your site's top navigation bar

1. Add links to docs, custom pages or external links by editing the headerLinks field of `website/siteConfig.js`:

`website/siteConfig.js`
```javascript
{
  headerLinks: [
    ...
    /* you can add docs */
    { doc: 'my-examples', label: 'Examples' },
    /* you can add custom pages */
    { page: 'help', label: 'Help' },
    /* you can add external links */
    { href: 'https://github.com/facebook/Docusaurus', label: 'GitHub' },
    ...
  ],
  ...
}
```

For more information about the navigation bar, click [here](https://docusaurus.io/docs/en/navigation)

## Adding custom pages

1. Docusaurus uses React components to build pages. The components are saved as .js files in `website/pages/en`:
1. If you want your page to show up in your navigation header, you will need to update `website/siteConfig.js` to add to the `headerLinks` element:

`website/siteConfig.js`
```javascript
{
  headerLinks: [
    ...
    { page: 'my-new-custom-page', label: 'My New Custom Page' },
    ...
  ],
  ...
}
```

For more information about custom pages, click [here](https://docusaurus.io/docs/en/custom-pages).

## Custom CSS & Design Changes

1. Changing logos for the Header and Footer and Favicon are done in website/siteConfig.js file in the /* path to images for header/footer */ section

Note: make sure that you add your new logos to the website/static/img folder first.

2. Change the main logo in the "SplashContainer" area of website/index.js file.

Note: make sure that you add your new logos to the website/static/img folder first.

3. Change the background color and the background transparent image in the website/static/css/custom.css file.

Go to the section labeled: .homeContainer 

Change "background-image" - and insert your new background image file. Note - make sure you add your new background transparent image file to the website/static/img folder first.

Change "background-color" to your Project's main color (FDC3 is #0033A0)

4. Change the .svg icons in the "gridBlock" (examples on FDC3 - the 4 .svg icons for API / Intents / Context Data / App Director) - you have to open the actual .svg files in the website/static/img folder with a program like Adobe Illustrator. Change the color of the entire file to your Project's main color (FDC3 is #0033A0) - and then save the file. The icon will change color. (NOote - If there is a way to change the .svg's using CSS, have not been able to do so yet. It should be possible.)

5. Change the section header titles (example for FDC3: Use Cases & Who is Usind FDC3) by changing the website/static/css/custom.css file. Change the h2 tags for .featureShowcaseSection h2 and .productShowcaseSection h2 to your Project's color (FDC3 is #0033A0).

6. Interior Introduction Page - Change logo by on this page (example for FDC3: docs/fdc3-intro.md) by changing the "(assets/fdc3-logo.png)" to the new logo name.

Note: make sure that you add your new logo to the docs/assets folder first - this is a separate image repository from the "website" part.

# users.json

iOS doesn't currently (July 2019) support .webp image files - so use .png - and force the code to use .png as well

# Full Documentation

Full documentation can be found on the [website](https://docusaurus.io/).
