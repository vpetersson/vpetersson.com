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

echo -e "\nRunning CSS linting..."
if ! stylelint "**/*.css" --ignore-pattern "_site/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo -e "\nRunning HTML linting..."
if ! htmlhint "**/*.html" --ignore "_site/**"; then
    EXIT_CODE=1
fi

echo -e "\nRunning JavaScript linting..."
if ! eslint "**/*.js" --ignore-pattern "_site/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo -e "\nRunning Markdown linting..."
if ! markdownlint "**/*.md" --ignore "_site/**" $FIX_ARG; then
    EXIT_CODE=1
fi

echo -e "\nRunning Ruby linting..."
if ! find . -name "*.rb" -not -path "./_site/*" -exec rubocop $([[ -n "$FIX_ARG" ]] && echo "-A") {} +; then
    EXIT_CODE=1
fi

exit $EXIT_CODE