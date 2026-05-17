// TODO: Replace with your deployed contract address after running:
// forge create ./contracts/src/Counter.sol:Counter \
//   --rpc-url https://sepolia.base.org \
//   --account deployer
export const COUNTER_ADDRESS = '0xE9bc6E4686fb9B6393E6C4A5998eb85a3Bef4863' as `0x${string}`

export const counterAbi = [
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
