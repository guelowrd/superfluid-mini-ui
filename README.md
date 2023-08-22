# Superfluid Widget + Lens Protocol

This is an example project showing how to build a simple React UI to start money streams towards wallets which are holding a Lens handle using [Superfluid Subscriptions Widgets](https://www.superfluid.finance/subscriptions).

If you cannot wait and want to see what the dApp looks like right away, here are the steps:
1. Clone this repo
```sh
git clone https://github.com/guelowrd/superfluid-mini-ui
```
2. Install the dependencies
```sh
npm install
# or yarn, pnpm
```
3. Run the app locally
```sh
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

*TODO: add screenshot*

Keep reading for the full step-by-step tutorial explaining how to make that frontend.

## Objectives

The purpose of this app will be to:
1. Allow the user to input an address in an input field
2. Check that the given address is valid, i.e. does hold a Lens handle
3. If the address is valid, allow the user to create a money stream using Superfluid Subscription Widget

## Setup

First, check that your development environment is ready.

If you don’t have **Node.js** installed, install it from [here](https://nodejs.org/en/). You’ll need Node.js version 10.13 or later.
You’ll be using your own text editor and terminal app for this tutorial.

> If you are on Windows, we recommend using [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

## Create a Next.js app

We are using Next.js to build our dApp, and more specifically the tool ```create-next-app``` which bootstraps a Next.js project for you.
To do so, open your terminal, ```cd``` into the directory you’d like to create the app in, and run the following command:
```sh
npx create-next-app@latest superfluid-mini-ui --use-npm
```

![create-next-app options](./public/create-next-app.png "create-next-app options")

You now have a new directory called ```superfluid-mini-ui```. Let’s ```cd``` into it and open your favorite editor:
```sh
cd superfluid-mini-ui && code .
```

## Install dependencies

In order to check if a given address holds a Lens handle, we will use the GraphQL client [apollo](https://docs.lens.xyz/docs/apollo-client) to query Lens data, and more specificaly [Get default profile](https://docs.lens.xyz/docs/get-default-profile) query.

*TODO: then superfluid dependencies, then wagmi & web3modal ones.*

## Use Lens API

*TODO*

## Setup Superfluid Subscription Widget

*TODO*

## Configure Wallet Connection

*TODO*

## Return the UI

*TODO*

## Ressources

[Lens API](https://docs.lens.xyz/docs/querying-from-an-application)

[Superfluid Subscription](https://docs.superfluid.finance/superfluid/developers/superfluid-subscriptions)

[Superfluid Widget Example using web3modal](https://github.com/superfluid-finance/widget/tree/master/examples/widget-vite-react-web3modal)