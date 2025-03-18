export default [
    {
        files: ["app/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "semi": ["error", "always"],
            "quotes": ["error", "single"],
            "no-unused-vars": "warn",
            "no-console": "off"
        },
    },
];