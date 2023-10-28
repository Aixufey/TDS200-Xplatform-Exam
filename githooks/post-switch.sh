#!/bin/bash

# Get the name of the branch we just switched to
BRANCH=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# If we switched to the developer branch, pull the latest changes
if [ "$BRANCH" == "developer" ]; then
    echo "Switched to developer branch, pulling latest from origin/developer..."
    git pull origin developer
elif [ "$BRANCH" == "main" ]; then
    echo "Switched to main branch, pulling latest from origin/main..."
    git pull origin main
fi
