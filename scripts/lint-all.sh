#!/bin/bash
set -e

# Check if we're running in CI
if [ -n "$CI" ]; then
    echo "Running in CI mode (without auto-fixing)"
    FIX_ARG=""
else
    echo "Running in local mode (with auto-fixing)"
    FIX_ARG="--fix"
fi

EXIT_CODE=0

echo "\nRunning CSS linting..."
if ! ./node_modules/.bin/stylelint "**/*.css" $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning HTML linting..."
if ! ./node_modules/.bin/htmlhint "**/*.html"; then
    EXIT_CODE=1
fi

echo "\nRunning JavaScript linting..."
if ! ./node_modules/.bin/eslint . --ext .js $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning Markdown linting..."
if ! ./node_modules/.bin/markdownlint "**/*.md" --ignore "node_modules/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning Ruby linting..."
if ! find . -name "*.rb" -exec rubocop $([[ -n "$FIX_ARG" ]] && echo "-A") {} +; then
    EXIT_CODE=1
fi

exit $EXIT_CODE