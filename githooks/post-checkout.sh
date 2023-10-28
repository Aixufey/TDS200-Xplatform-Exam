#!/bin/bash

# Get the name of the branch we just checked out
BRANCH=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# If we checked out the developer branch, pull the latest changes
if [ "$BRANCH" == "developer" ]; then
    echo "Checked out developer branch, pulling latest from origin/developer..."
    git pull origin developer
elif [ "$BRANCH" == "main" ]; then
    echo "Checked to main branch, pulling latest from origin/main..."
    git pull origin main
fi