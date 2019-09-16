module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        ".*\\.(js)$": "babel-jest",
        ".*\\.(vue)$": "vue-jest",
        ".*\\.(string)$": "jest-raw-loader",
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)": "jest-transform-stub"
    },
    testRegex: '^.*test\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue']
}
