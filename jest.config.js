module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "testMatch": [
    "**/tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "collectCoverageFrom": [
    "src/serialize/serialize.ts",
    "src/deserialize/deserialize.ts"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.test.json"
    }
  }
}
