/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
    return {
        verbose: true,
        testEnvironment: 'jsdom',
        transform: {
            '^.+\\.[jt]sx?$': 'babel-jest',
        },
        moduleFileExtensions: ['js', 'jsx'],
        setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
    };
};
