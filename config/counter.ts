import { base, baseSepolia } from 'wagmi/chains'

export const COUNTER_ADDRESSES: Record<number, `0x${string}`> = {
  [base.id]:        '0x1dEdB0Ef02831070858182e7F91586268aA806aE',
  [baseSepolia.id]: '0xE9bc6E4686fb9B6393E6C4A5998eb85a3Bef4863',
}

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