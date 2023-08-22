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

```sh
#npm
npm install --save @superfluid-finance/widget wagmi @superfluid-finance/tokenlist @apollo/client graphql @web3modal/ethereum @web3modal/react

#yarn
yarn add @superfluid-finance/widget wagmi @superfluid-finance/tokenlist @apollo/client graphql @web3modal/ethereum @web3modal/react
```

## Use Lens API

Let's create a new folder at the root, ```components```. In this folder we add a new file, ```lens.ts```, with the following code:

```ts
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const APIURL = 'https://api-mumbai.lens.dev/';

export const apolloClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
})
``` 

Doing this, we have created our ```ApolloClient``` that we will use for our API queries.
Now, in the same file, let's add the query we need to return the default profile for a given wallet -- if a given address does not hold a Lens handle, this will return ```null```:

```ts
export const query = gql(`
query DefaultProfile {
    defaultProfile(request: { ethereumAddress: "0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3"}) {
      id
      name
      bio
      isDefault
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      handle
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          contractAddress
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
  }
`)
```

## Setup Superfluid Subscription Widget

We then need to specify the properties of our Superfluid Subscription Widget: ```paymentOptions```, ```paymentDetails``` and ```productDetails```. 
We will create one file for each in our ```components``` folder:

```ts
//paymentOptions.ts
import { PaymentOption } from "@superfluid-finance/widget";

const paymentOptions: PaymentOption[] = [
    {
        chainId: 80001,
        receiverAddress: "0x7BDa037dFdf9CD9Ad261D27f489924aebbcE71Ac",
        superToken: {
            address: "0x42bb40bf79730451b11f6de1cba222f17b87afd7",
        },
        flowRate: {
            amountEther: "12345",
            period: "month",
        },
    },
];

export default paymentOptions;
```

```ts
//paymentDetails.ts
import { PaymentDetails } from "@superfluid-finance/widget";

import paymentOptions from "./paymentOptions";

const paymentDetails: PaymentDetails = {
    paymentOptions,
};

export default paymentDetails;
```

```ts
//productDetails.ts
import { ProductDetails } from "@superfluid-finance/widget";

const productDetails: ProductDetails = {
    name: "Superfluid Mini UI",
    description:
        "Superfluid Mini UI illustrates how to create a basic UI to set up a stream towards some Lens account holders.",
    successText: "Success! End of demo.",
    successURL: "#",
};

export default productDetails;
```

## Configure Wallet Connection

The rest of the logic will be inside ```./app/page.tsx```.
First we can remove the code automatically generated by ```create-next-app``` tool. Then, let's add all the ```import``` statements we need, setup our wallet connectivity configuration, with our ```Home()``` function signature (we will fill it in the next section):

```ts
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import SuperfluidWidget, {
  EventListeners,
  supportedNetworks,
  WalletManager,
} from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { useState, useMemo } from "react";
import { configureChains, createConfig, WagmiConfig, useNetwork } from "wagmi";

import paymentDetails from "../components/paymentDetails";
import productDetails from "../components/productDetails";
import { apolloClient, query } from "../components/lens";

const projectId = "952483bf7a0f5ace4c40eb53967f1368";

const { publicClient } = configureChains(supportedNetworks, [
  w3mProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    chains: supportedNetworks,
  }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, supportedNetworks);

export default function Home() { 
    // TODO
}
```

## Return the UI

*TODO*

## Ressources

[Lens API Doc](https://docs.lens.xyz/docs/querying-from-an-application)

[Superfluid Subscription Doc](https://docs.superfluid.finance/superfluid/developers/superfluid-subscriptions)

[Superfluid Widget Example using web3modal](https://github.com/superfluid-finance/widget/tree/master/examples/widget-vite-react-web3modal)
