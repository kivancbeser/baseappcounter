'use client'

import { useEffect } from 'react'
import {
  useSendCalls,
  useWaitForCallsStatus,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useQueryClient } from '@tanstack/react-query'
import { encodeFunctionData } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { config } from '@/config/wagmi'
import { useWalletCapabilities } from '@/hooks/useWalletCapabilities'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

const counterQueryKey = readContractQueryOptions(config, {
  address: COUNTER_ADDRESS,
  abi: counterAbi,
  functionName: 'number',
  chainId: baseSepolia.id,
}).queryKey

export function BatchIncrement() {
  const { isConnected } = useAccount()
  const { supportsBatching } = useWalletCapabilities()

  if (!isConnected) {
    return (
      <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
        <p className="text-xs font-mono text-zinc-700 text-center">
          Connect your wallet to increment
        </p>
      </div>
    )
  }

  return supportsBatching ? <BatchFlow /> : <SequentialFlow />
}

function TxStatus({ state }: { state: string }) {
  if (state === 'idle') return null

  const map: Record<string, { cls: string; label: string; spinner?: boolean }> = {
    signing:    { cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', label: 'Waiting for wallet signature…', spinner: true },
    confirming: { cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400',   label: 'Confirming on-chain…', spinner: true },
    success:    { cls: 'bg-green-500/10 border-green-500/20 text-green-400', label: '✓ Transaction confirmed!' },
    error:      { cls: 'bg-red-500/10 border-red-500/20 text-red-400',       label: 'Transaction failed' },
  }

  const s = map[state]
  if (!s) return null

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-mono mb-3 ${s.cls}`}>
      {s.spinner && (
        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
      )}
      {s.label}
    </div>
  )
}

function SwitchNetworkButton({ isSwitching, onSwitch }: { isSwitching: boolean; onSwitch: () => void }) {
  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
      <p className="text-xs font-mono text-zinc-600 mb-3">WRONG NETWORK</p>
      <button
        onClick={onSwitch}
        disabled={isSwitching}
        className="w-full py-3 px-4 rounded-xl bg-[#6050dc] hover:bg-[#7060ec] disabled:opacity-50 text-white text-sm font-semibold transition-all"
      >
        {isSwitching ? 'Switching…' : 'Switch to Base Sepolia'}
      </button>
    </div>
  )
}

function BatchFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data, sendCalls, isPending } = useSendCalls()
  const { isLoading: isConfirming, isSuccess } = useWaitForCallsStatus({ id: data?.id })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey })
    }
  }, [isSuccess, queryClient])

  if (chainId !== baseSepolia.id) {
    return <SwitchNetworkButton isSwitching={isSwitching} onSwitch={() => switchChain({ chainId: baseSepolia.id })} />
  }

  const isBusy = isPending || isConfirming
  const txState = isPending ? 'signing' : isConfirming ? 'confirming' : isSuccess ? 'success' : 'idle'

  const incrementData = encodeFunctionData({ abi: counterAbi, functionName: 'increment' })

  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono text-zinc-600">BATCH INCREMENT</p>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/25 text-purple-400">
          EIP-5792
        </span>
      </div>
      <p className="text-xs font-mono text-zinc-700 mb-3">
        2 calls bundled into 1 transaction via useSendCalls
      </p>
      <TxStatus state={txState} />
      <button
        onClick={() =>
          sendCalls({
            calls: [
              { to: COUNTER_ADDRESS, data: incrementData },
              { to: COUNTER_ADDRESS, data: incrementData },
            ],
            chainId: baseSepolia.id,
          })
        }
        disabled={isBusy}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6050dc] to-[#a050b0] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all hover:-translate-y-px active:translate-y-0"
      >
        {isBusy ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            {isPending ? 'Confirm in Wallet…' : 'Confirming…'}
          </span>
        ) : (
          'Increment × 2 (Batch)'
        )}
      </button>
    </div>
  )
}

function SequentialFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey })
    }
  }, [isSuccess, queryClient])

  if (chainId !== baseSepolia.id) {
    return <SwitchNetworkButton isSwitching={isSwitching} onSwitch={() => switchChain({ chainId: baseSepolia.id })} />
  }

  const isBusy = isPending || isConfirming
  const txState = isPending ? 'signing' : isConfirming ? 'confirming' : isSuccess ? 'success' : 'idle'

  return (
    <div className="bg-[#111218] border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono text-zinc-600">SINGLE INCREMENT</p>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/25 text-blue-400">
          EOA
        </span>
      </div>
      <TxStatus state={txState} />
      {isSuccess && hash && (
        <a
          href={`https://sepolia.basescan.org/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-mono text-[#6050dc] hover:text-[#a89ef0] mb-3 transition-colors"
        >
          {hash.slice(0, 10)}…{hash.slice(-6)} ↗
        </a>
      )}
      <button
        onClick={() =>
          writeContract({
            address: COUNTER_ADDRESS,
            abi: counterAbi,
            functionName: 'increment',
            chainId: baseSepolia.id,
          })
        }
        disabled={isBusy}
        className="w-full py-3 px-4 rounded-xl bg-[#6050dc] hover:bg-[#7060ec] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all hover:-translate-y-px active:translate-y-0"
      >
        {isBusy ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            {isPending ? 'Confirm in Wallet…' : 'Confirming…'}
          </span>
        ) : (
          'Increment'
        )}
      </button>
    </div>
  )
}
