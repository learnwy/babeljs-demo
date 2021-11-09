# eslint-plugin-eslint-plugin

eslint plugin for learnwy

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@learnwy/eslint-plugin`:

```sh
npm install @learnwy/eslint-plugin --save-dev
```

## Usage

Add `@learnwy/eslint-plugin` to the plugins section of your `.eslintrc` configuration file. You can only use the `@learnwy`:

```json
{
    "plugins": [
        "@learnwy/eslint-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@learnwy/import-no-index": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


