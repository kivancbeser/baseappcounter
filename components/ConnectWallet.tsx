'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isReconnecting) {
    return (
      <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
        <p className="text-xs font-mono text-zinc-600 mb-3">WALLET</p>
        <div className="flex items-center gap-2 text-sm font-mono text-zinc-500">
          <span className="w-3 h-3 rounded-full border-2 border-[#6050dc] border-t-transparent animate-spin" />
          Reconnecting…
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
        <p className="text-xs font-mono text-zinc-600 mb-3">WALLET</p>
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isConnecting}
              className="w-full py-3 px-4 rounded-xl bg-[#6050dc] hover:bg-[#7060ec] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all hover:-translate-y-px active:translate-y-0"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Connecting…
                </span>
              ) : (
                `Connect ${connector.name}`
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
      <p className="text-xs font-mono text-zinc-600 mb-3">WALLET</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6050dc] to-[#a050b0] flex items-center justify-center text-xs font-bold text-white">
            {address?.slice(2, 4).toUpperCase()}
          </div>
          <span className="font-mono text-sm text-white">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-xs font-mono text-red-400/80 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 rounded-lg px-3 py-1.5 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}
