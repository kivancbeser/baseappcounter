'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

const NETWORKS = [
  {
    chain: base,
    label: 'Base',
    color: 'from-[#0052ff] to-[#0040cc]',
    dot: 'bg-[#0052ff]',
  },
  {
    chain: baseSepolia,
    label: 'Base Sepolia',
    color: 'from-[#6050dc] to-[#4030bc]',
    dot: 'bg-[#6050dc]',
  },
]

export function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const active = NETWORKS.find((n) => n.chain.id === chainId) ?? NETWORKS[1]

  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
      <p className="text-xs font-mono text-zinc-600 mb-3">NETWORK</p>
      <div className="flex gap-2">
        {NETWORKS.map((n) => {
          const isActive = chainId === n.chain.id
          return (
            <button
              key={n.chain.id}
              onClick={() => switchChain({ chainId: n.chain.id })}
              disabled={isPending || isActive}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl
                text-sm font-semibold transition-all
                ${isActive
                  ? `bg-gradient-to-r ${n.color} text-white shadow-lg`
                  : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                }
                disabled:cursor-not-allowed
              `}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : n.dot + '/50'}`} />
              {isPending && !isActive ? 'Switching…' : n.label}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] font-mono text-zinc-700 mt-2">
        Chain ID: {chainId} · {active.label}
      </p>
    </div>
  )
}