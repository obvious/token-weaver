# Weaver

![CI-MAIN](https://github.com/obvious/weaver/actions/workflows/ci.yml/badge.svg?branch=main)
![CHECK-DIST](https://github.com/obvious/weaver/actions/workflows/check_dist.yml/badge.svg)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Weaver is a [GitHub Action] that enables syncing of tokens from your design system Figma to code. It automates the
process of updating your design system tokens in code each time a Figma token is updated. Hence, reducing developer
intervention needed in maintaining tokens across platforms.

The action integrates with [Figma Token Studio] plugin to transform the token's JSON the plugin creates. The action
supports Android and iOS platforms.

## Prerequisites

Make sure you have synced your design system tokens from Figma Token Studio to a GitHub repo. You
can follow [this](https://docs.tokens.studio/sync/github) guide to set it up.

Once that is done, we need to setup GitHub Actions in that repo to generate the files using
Weaver. If you're not familiar with setting up GitHub Actions, you can refer to their
[quickstart](https://docs.github.com/en/actions/quickstart) guide before moving on.

## Usage

Now that you have the tokens repo and GitHub Actions setup. Let's add Weaver to it to generate files.

1. Create a new GitHub Action called `run_weaver.yml`
2. Add a step to checkout your GitHub repo
   ```yaml
   - uses: actions/checkout@v3
     with:
       fetch-depth: 0
   ```
3. Add a step to run Weaver
   ```yaml
   - uses: obvious/weaver@v0.0.1
     with:
       # For example, let's say you have a repo called `figma_tokens` and you have saved your tokens
       # in a folder called `tokens` in that repo (`figma_tokens/tokens/`). You can just pass `tokens`,
       # since you have checked out the repo in 2nd step.
       tokens_path: 'path_to_your_tokens'
       output_path: 'output_path'
   ```
4. Access the generated files from the output directory passed to `output_path`. From here you can upload
   the files or raise a PR to appropriate repos

**Required parameters**

- `tokens_path` : Pass in the folder path where your Figma Token Studio tokens are present.
- `output_path` : Pass in the output folder path, where the files need to be generated

**Optional parameters**

- `project_name`: Name of the project/app (default: `App`). This would impact the Android XML style naming
- `version`: Version for the styles (default: `null`)

**Sample**

```yaml
uses: obvious/weaver@v0.0.1
with:
  tokens_path: 'tokens'
  output_path: 'output'
```

#### Expected JSON Structure

You can find a sample JSON structure in [sample_tokens] folder. We have a `core` file which contains
all of our global tokens, like colors, typography. Then we have individual theme files which has theme strucutre
and reference the core tokens.

### Output

Generates foundation(colors, typography, theme token files) in `output` folder. Which can
then be used to upload to the workflow or open PRs directly.

For example, the [`test_build_tokens`] workflow generates these outputs that are uploaded as an workflow artifact.

```
core/android
✔︎ ../output/android/res/colors.xml
✔︎ ../output/android/res/base_theme.xml
✔︎ ../output/android/res/theme_attrs.xml
...

core/ios
✔︎ ../output/iOS/BaseColor.swift
✔︎ ../output/iOS/ThemeColors.swift
✔︎ ../output/iOS/Theme.swift
...
```

## Contributing

### Pre-requisites

Project requires NodeJS and `npm` to build.

If you already have Node installed, skip this step. If not you can download [Node JS]

### Code styles

Project follows [gts] style guide. Couple of important commands we use are

Check lint & formatting issues

```
yarn run lint
```

Fix lint & formatting issues

```
yarn run fix
```

### Packaging

Project uses [vercel/ncc] to compile the project into a single JS file required for GH Actions. You can use
the following command to create the `dist` folder with required files.

```
yarn run package
```

## Pending Features

- [ ] Typography support for iOS

- [ ] Gradient colors support

- [ ] Jetpack Compose support

## License

```
MIT License

Copyright (c) 2023 Obvious

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[Figma Token Studio]: https://tokens.studio/

[Node JS]: https://nodejs.org/en/download/

[gts]: https://github.com/google/gts

[GitHub Action]: https://github.com/features/actions

[`test_build_tokens`]: https://github.com/obvious/weaver/actions/workflows/test_build_tokens.yml

[vercel/ncc]: https://github.com/vercel/ncc

[sample_tokens]: sample_tokens
