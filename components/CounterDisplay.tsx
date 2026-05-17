'use client'

import { useReadContract } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

export function CounterDisplay() {
  const { data: count, isLoading, isError } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterAbi,
    functionName: 'number',
    chainId: baseSepolia.id,
  })

  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-6 text-center">
      <p className="text-xs font-mono text-zinc-600 mb-4">COUNTER · {COUNTER_ADDRESS.slice(0, 10)}…</p>

      {isLoading && count === undefined ? (
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm font-mono h-20">
          <span className="w-3 h-3 rounded-full border-2 border-[#6050dc] border-t-transparent animate-spin" />
          Loading…
        </div>
      ) : isError && count === undefined ? (
        <p className="text-red-400/70 text-sm font-mono h-20 flex items-center justify-center">
          Failed to read contract
        </p>
      ) : (
        <p className="text-[5rem] font-extrabold text-white tracking-tighter leading-none">
          {count?.toString() ?? '–'}
        </p>
      )}

      <p className="text-xs font-mono text-zinc-700 mt-3">CURRENT COUNT</p>
    </div>
  )
}
