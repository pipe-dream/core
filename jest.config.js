module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        ".*\\.(js)$": "babel-jest",
        ".*\\.(vue)$": "vue-jest",
        ".*\\.(string)$": "jest-raw-loader",
    },
    testRegex: '^.*test\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
}
