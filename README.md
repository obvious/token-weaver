# Weaver

![CI-MAIN](https://github.com/obvious/weaver/actions/workflows/ci.yml/badge.svg?branch=main)

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

The project requires NodeJS and NPM to build. If you already have Node installed, skip this step. If not
you can download the [Node JS]


[Figma Token Studio]: https://tokens.studio/

[Amazon Style Dictionary]: https://amzn.github.io/style-dictionary/#/

[Node JS]: https://nodejs.org/en/download/
