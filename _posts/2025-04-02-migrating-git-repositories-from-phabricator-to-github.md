---
layout: post
title: 'Migrating Git repositories from Phabricator or Phorge to GitHub'
date: '2025-04-02T01:00:00+00:00'
tags:
- git
- github
- phabricator
- phorge
- migration
---

I recently helped a team migrate their Git repositories from Phabricator to GitHub. While Phabricator was a great tool that combined code reviews, task management, and repository hosting, its official deprecation in 2021 has left many teams looking for alternatives.

While moving directly from Phabricator to Phorge is often the simplest path (here's a [migration guide](https://we.phorge.it/w/why_migrating_from_phabricator_to_phorge/)), some teams prefer to keep their project management in Phabricator/Phorge while leveraging GitHub's CI/CD capabilities. Here's how we handled the Git migration:

### The Migration Process

#### 1. Setting up the GitHub Repository

Start by creating (a private), bare repository on GitHub for each repo you want to migrate.

#### 2. Creating a Dedicated Mirroring User

For security reasons, we created a dedicated GitHub user (we called it `foobar-bot`) specifically for repository mirroring. This is better than using personal accounts because:

- It keeps the mirroring credentials separate from personal accounts
- It makes it easier to manage permissions
- It provides better audit trails

The setup involves:

- Creating a new SSH key pair
- Adding the public key to the bot's GitHub account
- Storing the private key in Phabricator's credential store

#### 3. Setting up Repository Access

After creating the bot account, invite it to your private repository with read-only permissions. Important: Make sure to accept the invitation from the bot account itself, or the mirroring won't work.

#### 4. The Actual Migration

Here's the command sequence we used to migrate the repositories:

```bash
git clone --mirror ssh://git@phabricator.mydomain.com/path/to/repo
cd repo.git
git push --mirror git@github.com:MyTeam/repo.git
```

This approach preserves all history, branches, and tags.

#### 5. Configuring Phabricator/Phorge

After the migration, you'll need to update Phabricator/Phorge to observe the GitHub repository:

1. Go to your repository in Phabricator/Phorge
2. Navigate to `Manage` -> `URI`
3. Update the original URI:
   - Set `I/O Type` to **Read Only**
   - Set `Display Type` to **Hidden**
4. Add a new URI:
   - Set `I/O Type` to **Observe**
   - Set `Display Type` to **Visible**
   - Choose **GitHub** under "Credentials" and link it to your bot account

This configuration keeps everything in sync while maintaining proper access controls.

### Why This Matters

Phabricator started as a Facebook project and gained popularity for its comprehensive feature set. While Phorge keeps the ecosystem alive, many teams are moving their Git operations to GitHub for better integration with modern development tools.

This hybrid approach lets you keep what works in Phabricator/Phorge while getting GitHub's benefits. It's not about following trends—it's about making your development workflow more efficient and maintainable.

If you're still using Phabricator or Phorge, now might be a good time to consider this migration. The longer you wait, the more complex it might become.
