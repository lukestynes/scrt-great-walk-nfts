## Setup Instructions

This section provides instructions on how to set up the Great Walk NFT Experience project on your local machine. You will need to deploy the smart contract to the Secret Network, set up the frontend, and interact with the contract using the Keplr wallet.

If you wanted to try out the live application, you can visit the [Live Application URL](https://scrt-great-walk-nfts.vercel.app/).

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (version 14 or later)
- **Keplr Wallet** (installed in your browser for interacting with the Secret Network)
- **Secret Network Testnet account** (for testing the contract interactions)
- **Git** (for cloning the repository)

### 1. Clone the Repository

Start by cloning the project from GitHub:

```bash
git clone https://github.com/lukestynes/scrt-great-walk-nft.git
cd great-walks-nft
```

### 2. Setup Smart Contracts
You first need to build the smart contract to wasm and compress it. Navigate to the `great-walk-smart-contract` directory and run the following:

```bash
make compile-optimized-reproducible
```

This will create a `contract.wasm.gz` file in the `great-walk-smart-contract/artifacts` directory. You will need to deploy this contract to the Secret Network and obtain the contract address and code hash.

### 3. Upload the Contract
You can deploy the contract to the Secret Network using the included pulsar-scripts. Navigate to the `pulsar-scripts` directory and run the following:

Make sure you create a `.env` file first, in here you need to put your keplr wallet mnemonic.

```bash
MNEMONIC="<Your Keplr Wallet Mnemonic>"
```

After that you need to install the dependencies:

```bash
npm install
```

Then you can upload the contract:

```bash
npm run upload
```

This will deploy the contract to the Secret Network and output the code_id and code hash. You will need to use these values in the frontend setup.
Keep note of the `code_hash` value for your `.env` for your frontend setup.

### 4. Instantiate the Contract
After deploying the contract, you need to instantiate it. Run the following:

```bash
npm run instantiate <code_id> <code_hash>
```

Replace `<code_id>` and `<code_hash>` with the values obtained from the previous step.

This will instantiate the contract on the Secret Network and output the contract address. Keep note of this value for your frontend `.env`.


### 5. Setup Frontend
Navigate to the `frontend` directory and install the dependencies:

```bash
npm install
```

Create a `.env.local` file in the `frontend` directory and add the following environment variables:

```bash
# These variables are exposed to the client.
NEXT_PUBLIC_CHAIN_ID="pulsar-3" # or mainnet chain ID, such as secret-4
NEXT_PUBLIC_RPC_URL="https://rpc.pulsar.scrttestnet.com" # Testnet RPC endpoint
NEXT_PUBLIC_CONTRACT_ADDRESS="<Your Deployed Contract Address>"
NEXT_PUBLIC_CODE_HASH="<Your Contract Code Hash>"
NEXT_PUBLIC_ADMIN_WALLET="<Your wallet address>"

#This variable is never exposed to the client.
ADMIN_MNEMONIC="your wallet mnemonic"
```

### 6. Start the Frontend
Run the following to start a local development server:

```bash
npm run dev
```

The frontend should now be running on [http://localhost:3000](http://localhost:3000).

### 7. Interact with the Contract
Assuming you have the Keplr wallet extension installed in your browser, you can now interact with the contract. You can mint NFTs, transfer them, and view the NFTs you own.

The frontend uses the Keplr wallet as the authentication method, so you will need to sign transactions using Keplr.

More information about usage of the frontend can be found in the [Usage](#usage) section of the documentation.
