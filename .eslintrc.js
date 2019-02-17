module.exports = {
    "extends": "airbnb",
    "rules": {
        "react/prefer-stateless-function": "off",

        // Indent with 4 spaces
        "indent": ["error", 4],

        // Indent JSX with 4 spaces
        "react/jsx-indent": ["error", 4],

        // Indent props with 4 spaces
        "react/jsx-indent-props": ["error", 4],

        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],

        'no-console': "off",
        'comma-dangle': "off",
        "object-curly-spacing": "off",
        "prefer-const": "off",
        "object-curly-newline": "off",
        "max-len": [2, { code: 150 }],
        "no-underscore-dangle": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
    }
};