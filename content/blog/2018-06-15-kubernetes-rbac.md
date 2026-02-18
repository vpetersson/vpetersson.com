---
slug: kubernetes-rbac
title: Kubernetes and RBAC with examples
date: '2018-06-15T13:00:00+01:00'
tags:
- kubernetes
- linux
- devops
- security
---

In Kubernetes 1.8, RBAC was introduced to improve the security. Prior RBAC, any pod is more or less able to interact with the rest of the cluster without constraints. This means you can create new pods, delete other deployments etc from any other pod. Needless to say, this is not ideal and RBAC sets out to address this.

While RBAC is a rather complicated topic, this brief article sets out to give a very simplistic crash course to get you started (while intentionally leaving big parts out).

What I wanted to do was to grant the deployment(s) the bare minimum permission to operate. For instance, if you have a simple app that neither uses Secrets or ConfigMaps, you can configure this using RBAC.

Below I'll walk through two examples. One deployment that is fully locked down, and one that only has access to Secrets.

Please do note that you need to have an RBAC enabled cluster for this to work. `minikube` for instance comes with this by default.

## RBAC in 15 seconds

RBAC can be used for many things, but in this article we will purely focus on the runtime side of RBAC and not for cluster authentication. With that in mind, there are three main concepts that you need to keep in mind:

- Role: A role is what defines the actual RBAC permission
- Service Account: This is what you associate with your deployment (or similar)
- RoleBinding: This is what applies the Role to the Service Account

This is vastly simplified, but that should hopefully help you wrap your head around the concept.

## A fully locked down deployment

(You can find the files referenced below [here](https://github.com/vpetersson/rbac-example/tree/master/locked-down-nginx).)

First, we create namespace to stash our deployment into:

```
$ kubectl create ns lockdown
```

Next, we need to create a service account (which we will call 'sa-lockdown'):

```
$ kubectl create serviceaccount --namespace lockdown sa-lockdown
```

We now need to create the [role](https://github.com/vpetersson/rbac-example/blob/master/locked-down-nginx/role.yaml) that defines a fully locked down RBAC role.

The role will look like this:

```
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: lockdown
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: [""]
  verbs: [""]
```

Simply apply the role using `kubectl create -f role.yaml`.

The important part here to note is that we simply do not define any explicit rules.

Next, we need to define a RoleBinding to map the Role to the Service Account we created earlier:

```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: rb-lockdown
subjects:
- kind: ServiceAccount
  name: sa-lockdown
roleRef:
  kind: Role
  name: lockdown
  apiGroup: rbac.authorization.k8s.io
```

Apply the role using `kubectl create -f rolebinding.yaml`.

With that applied, we can now check the permission using the `can-` feature:

```
$ kubectl auth can-i get pods \
        --namespace lockdown \
        --as system:serviceaccount:lockdown:sa-lockdown
no
```

Lastly, we can create our Nginx deployment:

```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      serviceAccountName: sa-lockdown
      containers:
      - name: nginx
        image: nginx:1.13
        ports:
        - containerPort: 80
```

Again, apply this using `kubectl create -f deployment.yaml`.

That's it. You are now running a fully locked down Nginx container (as far as RBAC goes at least).

## RBAC with Secrets enabled

Many (most?) deployments require things like ConfigMaps and Secrets. As such, we need to modify our approach slightly and grant explicit access to this. Fortunately, this is very straight forward too. All we really need to do (in addition to creating the Secrets) is to modify our role definition to look something like this:

```
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: role-lockdown-secrets
  namespace: lockdown-secrets
rules:
  - apiGroups: [""] # "" indicates the core API group
    resources: ["secrets"]
    verbs: ["get", "watch", "list"]
```

As you can see, that provides explicit permission to read secrets. Other than that the setup is the same and you can find the full example [here](https://github.com/vpetersson/rbac-example/tree/master/only-secrets).

That's it. Hopefully this helped you get started with locking down your system using RBAC.
