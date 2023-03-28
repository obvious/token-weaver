# Weaver

![CI-MAIN](https://github.com/obvious/weaver/actions/workflows/ci.yml/badge.svg?branch=main)
![CHECK-DIST](https://github.com/obvious/weaver/actions/workflows/check_dist.yml/badge.svg)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Weaver is a [GitHub Action] that enables syncing of tokens from your design system Figma to code. It automates the process of updating your design system tokens in code each time a Figma token is updated. Hence, reducing developer intervention needed in maintaining tokens across platforms. 

The action integrates with Figma [Token Studio](https://www.figma.com/community/plugin/843461159747178978/Tokens-Studio-for-Figma-(Figma-Tokens)) plugin to transform the token's JSON the plugin creates. The action supports Android and iOS platforms. 

## Usage

Add the following Github action to your CI workflow.

```yaml
uses: obvious/weaver@v0.0.1
with:
  tokens_path: 'tokens'
  output_path: 'output'

# Raise PRs adding the generated files
```

**Required parameters**

- `tokens_path` : Local absolute path to the Figma Token Studio `tokens.json` file
- `output_path` : Local absolute path where the generated files are written. 

**Optional parameters**

- `project_name`: Name of the project/app (default: `App`)
- `version`: Version for the styles (default: `null`)

**Sample**

```yaml
uses: obvious/weaver@v0.0.1
with:
  tokens_path: '/Users/tokens.json'
  output_path: 'output'
```



#### Expected JSON Structure

You can find the sample JSON structure we are using in [sample_tokens] folder. We have a `core` file which contains
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

If you already have Node installed, skip this step. If not you can download the [Node JS]

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

  

## References 

[Figma Token Studio]: https://tokens.studio/

[Node JS]: https://nodejs.org/en/download/

[gts]: https://github.com/google/gts

[GitHub Action]: https://github.com/features/actions

[`test_build_tokens`]: https://github.com/obvious/weaver/actions/workflows/test_build_tokens.yml

[vercel/ncc]: https://github.com/vercel/ncc

[sample_tokens]: sample_tokens
