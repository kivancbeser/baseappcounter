import { ConnectWallet } from '@/components/ConnectWallet'
import { CounterDisplay } from '@/components/CounterDisplay'
import { BatchIncrement } from '@/components/BatchIncrement'
import { NetworkSwitcher } from '@/components/NetworkSwitcher'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 bg-[#6050dc]/15 border border-[#6050dc]/30 rounded-full px-3 py-1 text-[11px] font-mono text-[#a89ef0] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6050dc] animate-pulse" />
            Base Network
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Onchain Tally</h1>
          <p className="text-sm font-mono text-zinc-600 mt-1">wagmi + viem + EIP-5792</p>
        </div>
        <ConnectWallet />
        <NetworkSwitcher />
        <ChainAwareContent />
      </div>
    </main>
  )
}