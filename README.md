# Weaver

![CI-MAIN](https://github.com/obvious/weaver/actions/workflows/ci.yml/badge.svg?branch=main)
![CHECK-DIST](https://github.com/obvious/weaver/actions/workflows/check_dist.yml/badge.svg)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Weaver is a tool to transform the [Figma Token Studio] tokens to platform specific theme files
using [Amazon Style Dictionary]

## Usage

```yaml
uses: obvious/weaver@v0.0.1
with:
  tokens_path: 'tokens/tokens.json'
  output_path: 'output'
```

### Inputs

- `tokens_path` (**Required**): Path to the Figma Token Studio `tokens.json` file
- `output_path` (**Required**): Path to write the generated files to

## Contributing

### Pre-requisites

Project requires NodeJS and NPM to build. If you already have Node installed, skip this step. If not
you can download the [Node JS]

### Code styles

Project follows [gts] style guide. Couple of important commands we use are

Check lint & formatting issues
```
npm run lint
```

Fix lint & formatting issues
```
npm run fix
```

[Figma Token Studio]: https://tokens.studio/

[Amazon Style Dictionary]: https://amzn.github.io/style-dictionary/#/

[Node JS]: https://nodejs.org/en/download/

[gts]: https://github.com/google/gts
