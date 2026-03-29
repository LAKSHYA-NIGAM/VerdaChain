# How to Deploy VerdaChain Smart Contract

## Prerequisites
- MetaMask browser extension installed
- MetaMask configured for **Sepolia Testnet**
- Sepolia ETH for gas (get free ETH from https://sepoliafaucet.com)

## Steps

1. Go to https://remix.ethereum.org
2. Create a new file: `VerdaChain.sol` — paste the contract from this folder
3. **Compiler tab** → Select compiler `0.8.x` → Click **Compile VerdaChain.sol**
4. **Deploy & Run tab** → Environment: **Injected Provider - MetaMask**
5. Ensure MetaMask is on **Sepolia Testnet** (not Mainnet!)
6. Click **Deploy** → Approve the transaction in MetaMask
7. Copy the **deployed contract address** shown in Remix (under "Deployed Contracts")
8. Open `src/lib/blockchain.ts` in the VerdaChain project
9. Replace `"0xYourContractAddressHere"` with the copied address
10. Save and restart the dev server (`npm run dev`)

## Testing
After deployment, you can test the contract in Remix:
- Call `logVerification("VCU-12345", <bytes32>, 78, "HIGH RISK")`
- Check `getTotalCount()` returns 1
- Check `getVerifications("VCU-12345")` returns the record
