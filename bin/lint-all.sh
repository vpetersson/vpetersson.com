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
if ! stylelint "**/*.css" $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning HTML linting..."
if ! htmlhint "**/*.html"; then
    EXIT_CODE=1
fi

echo "\nRunning JavaScript linting..."
if ! eslint . --ext .js $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning Markdown linting..."
if ! markdownlint "**/*.md" --ignore "node_modules/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo "\nRunning Ruby linting..."
if ! find . -name "*.rb" -exec rubocop $([[ -n "$FIX_ARG" ]] && echo "-A") {} +; then
    EXIT_CODE=1
fi

exit $EXIT_CODE