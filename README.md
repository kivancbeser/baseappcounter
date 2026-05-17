# Onchain Tally

Base Sepolia üzerinde çalışan bir tally (sayaç) uygulaması.
wagmi + viem + EIP-5792 batch transactions.

---

## Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Kontratı deploy et (Foundry)

Önce Foundry yükle:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Deployer cüzdanını kaydet:

```bash
cast wallet import deployer --interactive
```

Kontratı deploy et:

```bash
forge create ./contracts/src/Counter.sol:Counter \
  --rpc-url https://sepolia.base.org \
  --account deployer
```

Çıktıdaki `Deployed to:` adresini kopyala.

### 3. Kontrat adresini güncelle

`config/counter.ts` dosyasını aç, `COUNTER_ADDRESS` değerini deploy ettiğin adresle değiştir:

```ts
export const COUNTER_ADDRESS = '0xYOUR_CONTRACT_ADDRESS' as `0x${string}`
```

### 4. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` aç.

---

## Vercel'e Deploy

```bash
npm install -g vercel
vercel
```

veya GitHub'a push edip Vercel dashboard'dan import et.

---

## Yapı

```
onchain-tally/
├── app/
│   ├── layout.tsx          # Root layout + Providers
│   ├── page.tsx            # Ana sayfa
│   ├── providers.tsx       # WagmiProvider + QueryClientProvider
│   └── globals.css
├── components/
│   ├── ConnectWallet.tsx   # Wallet bağlantı durumları (4 state)
│   ├── CounterDisplay.tsx  # useReadContract ile sayaç okuma
│   └── BatchIncrement.tsx  # EIP-5792 batch + EOA fallback
├── config/
│   ├── wagmi.ts            # Chain, connector, transport config
│   └── counter.ts          # Kontrat adresi + ABI
├── hooks/
│   └── useWalletCapabilities.ts  # EIP-5792 capability detection
└── contracts/
    └── src/Counter.sol     # Foundry kontratı
```

---

## Test ETH al

Base Sepolia ETH için: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
