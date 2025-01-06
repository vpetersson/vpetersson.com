## vpetersson.com

### Adding new gems

To add new gems to the project:

```bash
# Add a new gem using docker compose
docker compose run --rm web bundle add jekyll-seo-tag  # Replace with the gem you want to add
```

### Updating dependencies

To update all dependencies in the lockfile:

```bash
docker compose run --rm web bundle update
```