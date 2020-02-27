module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "overrides": [
        {
            "files": ["*.ts", "*.tsx"],
            "rules": {
                "@typescript-eslint/tslint/config": ["error", {
                    "lintFile": "./tslint.json"
                }]
            }
        }
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "disable"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
