# Weaver

Weaver is a tool to transform the [Figma Token Studio] tokens to platform specific theme files
using [Amazon Style Dictionary]

## Pre-requisites

The project requires NodeJS and NPM to build. If you already have Node installed, skip this step. If not
you can download the [Node JS]

## How to generate DLS files locally

- Clone to the repo
  ```bash
  git clone git@github.com:obvious/weaver.git
  ```

- Install the dependencies that are required to build
  ```bash
  npm install
  ```

- Make sure you have the [Figma Token Studio] `tokens.json` file in the [tokens](/tokens) directory

- Generate the DLS styles files using the following command
  ```bash
  npm run build-styles
  ```

- You can find the generated files in `output` directory

[Figma Token Studio]: https://tokens.studio/

[Amazon Style Dictionary]: https://amzn.github.io/style-dictionary/#/

[Node JS]: https://nodejs.org/en/download/
