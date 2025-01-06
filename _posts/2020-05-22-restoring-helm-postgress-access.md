---
layout: post
title: Restoring access to PosgreSQL after Helm upgrade
date: '2020-05-22-08T13:00:00+01:00'
tags:
- helm
- kubernetes
- devops
- note-to-self
- postgresql
---

If you've used PostgreSQL in Kubernetes with Helm, chance are you've [locked yourself out](https://github.com/helm/charts/tree/master/stable/sentry#postgressql) after performing an upgrade. The reason for this is that if you do not specify a password explicitly using `postgresqlPassword`, Helm will rotate this password for you when you run `helm upgrade`. Not ideal. This has happened to me a few times over the years.

To restore access, you need to to jump in to your PostgreSQL container (`kubectl exec -ti your-postgres-container -n your-namespace bash`) and temporarily alter the authentication. This of course is not ideal, so we want to move as swiftly as possible.

From within the container, run the following commands:
```
sed -i 's/md5/trust/' /opt/bitnami/postgresql/conf/pg_hba.conf
pkill -HUP postgres
```

This will allow us to access the PostgreSQL server **without** authentication and reload the config.

Next, login to the PostgreSQL server and set a password:

```
$ psql -h 127.0.0.1 -U postgres
psql (11.5)
Type "help" for help.

postgres=# ALTER USER postgres WITH PASSWORD 'my-password';
ALTER ROLE
postgres=# \q
```

Finally, kill the PostgreSQL server, which should automatically terminate your connection:

```
$ pkill postgres
command terminated with exit code 137
```

When it comes back, the changes to `pg_hba.conf` should have been reverted, and you should now be able to access the server using the password you set above.
