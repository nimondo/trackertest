module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        '!**/node_modules/**',
    ],
};