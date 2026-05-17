'use client'

import { useReadContract, useChainId } from 'wagmi'
import { COUNTER_ADDRESSES, counterAbi } from '@/config/counter'

export function CounterDisplay() {
  const chainId = useChainId()
  const contractAddress = COUNTER_ADDRESSES[chainId]

  const { data: count, isLoading, isError } = useReadContract({
    address: contractAddress,
    abi: counterAbi,
    functionName: 'number',
    chainId,
    query: { enabled: !!contractAddress },
  })

  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-6 text-center">
      <p className="text-xs font-mono text-zinc-600 mb-4">
        COUNTER · {contractAddress ? contractAddress.slice(0, 10) + '…' : 'Not deployed on this network'}
      </p>
      {!contractAddress ? (
        <p className="text-yellow-500/70 text-sm font-mono h-20 flex items-center justify-center">No contract on this network</p>
      ) : isLoading && count === undefined ? (
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm font-mono h-20">
          <span className="w-3 h-3 rounded-full border-2 border-[#6050dc] border-t-transparent animate-spin" />
          Loading…
        </div>
      ) : isError && count === undefined ? (
        <p className="text-red-400/70 text-sm font-mono h-20 flex items-center justify-center">Failed to read contract</p>
      ) : (
        <p className="text-[5rem] font-extrabold text-white tracking-tighter leading-none">{count?.toString() ?? '–'}</p>
      )}
      <p className="text-xs font-mono text-zinc-700 mt-3">CURRENT COUNT</p>
    </div>
  )
}