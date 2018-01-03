---
layout: post
title: Notes on MongoDB, GridFS, sharding  and deploying in the cloud
date: '2012-01-29T14:24:18+02:00'
tags:
- MongoDB
redirect_from: /post/92729957389/notes-on-mongodb-gridfs-and-sharding-in-the-cloud
---
[We](http://wireload.net)‘ve been using MongoDB in production for about six months with [YippieMove](http://www.yippiemove.com). It’s been an interesting experience and we’ve learned a lot.

Contrary to many MongoDB deployments, we primarily use it for storing files in GridFS. We switched over to MongoDB after searching for a good distributed file system for years. Prior to MongoDB we used a regular NFS share, sitting on top of a [HAST](/2010/09/27/setting-up-a-redundant-nas-with-hast-with-carp/)-device. That worked great, but it didn’t allow us to scale horizontally the way a distributed file system allows.

Enter MongoDB. Just like most people playing around with MongoDB, we started out with a simple [Replica Set](http://www.mongodb.org/display/DOCS/Replica+Sets), but are now in the process of switching to a sharded setup.

In the post, I will go over some of the things we’ve learned when using MongoDB.  

Running MongoDB in the Cloud
----------------------------

One major thing to keep in mind when deploying MongoDB is that it matters a lot if you are deploying in a public cloud or on dedicated server. We deployed in a public cloud. While we did get good performance compared to many other cloud vendors, the performance were of course not at par with beefy dedicated servers (but came with other benefits instead).

The biggest constrain with running in the cloud is limited I/O performance. We get about 60-80MB/s in writes, and 80-100MB/s in reads from our disks. That isn’t super fast for something like MongoDB, and we need to keep that in mind when we design the architecture.

When we started out, we started with a replica set with three members (Primary + 2x Secondary). That worked well initially, and it felt good knowing that all data was backed up 3x. The problem however was that during heavy load, we saw that the secondary nodes fell behind. If the heavy load lasted long, the secondary nodes fell far behind such that they fell out of the opsize, and hence couldn’t catch up.

To cope with this, we changed our strategy a bit and turned one of the secondaries into an arbiter. That offloaded the primary server significantly. If one were to run with dedicated servers on beefy hardware, I do not think this would be an issue at all. This was primarily due to the low I/O performance, and a cloud-specific issue.

The setup we ended up then with was as follows:

![](http://viktorpetersson.com/upload/primary_secondary_arbiter.png "Primary, Secondary and Arbiter")

Replica Set
-----------

Setting up a Replica Set with MongoDB is very straight forward. It is recommended that you use three servers for a replica set. Two of which should be more or less dedicated to MongoDB, while the third is the arbiter, and can run on another server that isn’t necessarily dedicated to MongoDB. The arbiter isn’t resource intense, and is only used to keep track of the other two servers and vote for which one should be the primary.

The process of setting up a replica set is simple and the instructions can be found [here](http://www.mongodb.org/display/DOCS/Replica+Set+Configuration). The only thing you might want to do differently from that guide is to instead of adding two nodes, add one node and one arbiter (using the command ‘rs.addArb(“node:port)’).

We also found it handy to set priorities for the two replica nodes. We can do this by simply bumping the node we prefer to be the primary to ’2′ using the following commands:

    cfg = rs.conf()
    cfg.members\[0\].priority = 2
    rs.reconfig(cfg)

Please note that cfg.member\[N\] is the list item from the top (the first one being 0). It’s **not** the id. More information is available [here](http://www.mongodb.org/display/DOCS/Reconfiguring+when+Members+are+Up).

In case you need to take down the primary server for maintenance, you should use the StepDown-command. This will gracefully force the primary server to step down. To do this, log into the server and issue the following command:

    use admin
    rs.stepDown()

Once you’ve validated that the server is ‘secondary’ you can shut the server down without worrying about dataloss.

There are two other commands that you should also be aware about. The first command is:

    rs.status()

This command gives you information about your replica set and replication.

The second dommand is:

    db.serverStatus()

This will give you detailed information about the individual node.

Let the sharding begin
----------------------

Sharding is a bit more tricky than setting up a simple replica set, but a lot easier than sharding a sequel database. While it is not necessary that each member of a shard is a replica set, it is highly recommended for redundancy purposes. Hence, the way you should be thinking about sharding in MongoDB as a way to consolidate multiple replica sets.

Here’s an illustration of how one would expand the replica set we described above with a shard.  
![](http://viktorpetersson.com/upload/shard.png "Sharded")

Let’s now assume that you have two replica sets configured and ready to go. How do you turn them into a shard?

The first thing you will need is to set up config-servers and mongos-nodes. The config-servers holds critical data about your shard(s). If that data gets lost, you’re basically toast. Hence, you want at least three of these servers. Mongos is the router that all your nodes will communicate against. The clients won’t be able to tell the difference if they are talking to a mongos or a regular replica set, which is nice.

You will also need to restart mongod with a few new flags.

To spin up a regular mongod-node (primary or secondary), use this command (assuming the replica set name is ‘repl0′:

    sudo -u mongodb mongod --shardsvr --replSet repl0 --dbpath /mongo/repl0 --fork --logpath /var/log/mongodb/repl0.log

To spin up a config-server, use the following command (note oplogsize is set to 1 to minimize disk space being wasted):

    sudo -u mongodb mongod --configsvr --dbpath /mongo/configsvr --fork -–oplogSize 1 --logpath /var/log/mongodb/configsvr.log

Finally, you need to spin up the mongos (we assume node1, node2, node 4 and node5 are the config-servers):

    sudo -u mongodb mongos --configdb :,:,:,: --fork --logpath /var/log/mongodb/mongos.log 

Once you have all the servers up and running, it’s time to start sharding.

Start by opening a mongo-session against one of the mongos-servers. Now we need to add the replica sets to the the shard:

    use admin
    db.runCommand( { addshard : "repl0/:,:,:", maxSize:10000/\*MB\*/ } );
    db.runCommand( { addshard : "repl1/:,:,:", maxSize:10000/\*MB\*/ } ); 

The should add both replica sets to the shard. We also specified that the maximum storage each replica set should hold to 10GB. Please note that this is a soft limit, and the balancer will use this as a guideline to evenly spread the data.

Now we have prepared everything that needed preparation. Now it’s time to actually shard the data. Let’s assume that we have a collection/database named MyStuff that we want to shard. Let’s also assume that this is primarily used for GridFS.

Once again, log into mongos, but now run the following commands:

    use admin
    db.runCommand( { enablesharding : "MyStuff" } );

Next we need to tell Mongo how to shard the data. Let’s use the files_id:

    use MyStuff
    db.fs.chunks.ensureIndex( { files_id: 1 } );
    db.fs.files.ensureIndex( { files_id: 1 } );
    db.runCommand( { shardcollection : "db.fs.chunks", key : { files_id : 1 } } )
    db.runCommand( { shardcollection : "db.files.chunks", key : { files_id : 1 } } )

Depending on your load, using files_id can be a bad idea as won’t evenly distribute the load across the nodes. However, this is a whole different topic.

Once you got everything setup, you might want to know more about how your system. There are a few commands that will give you a good overview about your system (in addition to the ones mentioned above).

To get more information about your system, you might find the following commands useful:

    db.printShardingStatus()
    db.runCommand( { listShards : 1} );

Another useful command, if you need to reorganize your setup, is removeshard:

    db.runCommand( { removeshard : "repl0" } );

It’s likely that you want to learn more about MongoDB before you get started. I would then recommend the following resource:

* [Sharding Introduction](http://www.mongodb.org/display/DOCS/Sharding+Introduction)
* [Configuring Sharding](http://www.mongodb.org/display/DOCS/Configuring+Sharding)
* [Choosing a Shard Key](http://www.mongodb.org/display/DOCS/Choosing+a+Shard+Key)
* [How to Choose a Shard Key: The Card Game](http://www.snailinaturtleneck.com/blog/2011/01/04/how-to-choose-a-shard-key-the-card-game/)

Please note that I’m by no means a MongoDB guru, but feel free to drop a comment below, and I’ll try to answer.
