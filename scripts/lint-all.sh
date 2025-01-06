#!/bin/sh
set -e

EXIT_CODE=0

# Determine if we're running in CI
if [ -n "$CI" ]; then
    FIX_ARG=""
    echo "Running in CI mode (no auto-fixing)"
else
    FIX_ARG="--fix"
    echo "Running in local mode (with auto-fixing)"
fi

echo "\nRunning CSS linting..."
if ! stylelint "**/*.css" --config .stylelintrc.json --ignore-path .gitignore --ignore-pattern "_site/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning HTML linting..."
if ! htmlhint "**/*.html" --config .htmlhintrc --ignore "_site/**"; then
    EXIT_CODE=1
fi

echo "\nRunning JavaScript linting..."
if ! eslint "**/*.js" --config .eslintrc.json --ignore-pattern "_site/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning Markdown linting..."
if ! markdownlint "**/*.md" --config .markdownlint.json --ignore "_site/**" $FIX_ARG; then
    EXIT_CODE=1
fi

exit $EXIT_CODE