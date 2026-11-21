<div align="center">

# 🌿 VerdaChain
### The Carbon Credit Lie Detector

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind]
[![CI](https://github.com/LAKSHYA-NIGAM/VerdaChain/actions/workflows/ci.yml/badge.svg)](https://github.com/LAKSHYA-NIGAM/VerdaChain/actions/workflows/ci.yml)
(https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**🏆 Hackstacy 2.0 Finalist — Top 12 out of 400+ teams**

A premium full-stack SaaS application that verifies carbon credits instantly using an AI-powered risk engine and blockchain-backed transparency — helping investors and organizations detect carbon credit fraud and greenwashing before it hits the market.

[🚀 Live Demo](https://veda-chain-rosy.vercel.app/) · [Report Bug](https://github.com/LAKSHYA-NIGAM/VerdaChain/issues) · [Request Feature](https://github.com/LAKSHYA-NIGAM/VerdaChain/issues)

</div>

---

## 📌 About The Project

VerdaChain tackles one of the biggest problems in the carbon market — **fraud and greenwashing**. Carbon credits are often issued without proper verification, leading to billions in fraudulent transactions annually. VerdaChain provides instant, tamper-proof verification by combining a multi-layer AI risk engine, real satellite imagery analysis, and immutable blockchain records.

**Built and presented at Hackstacy 2.0 — selected as Top 12 Finalist out of 400+ teams.**

---

## ✨ Core Features

### 🧠 AI Verification Engine
A multi-layer machine learning risk engine that cross-checks **15+ independent risk vectors** for every carbon credit submitted. Analyzes registry conflicts, issuer history, and MRV methodology audits — scoring every credit from 0–100.

### 🔗 On-Chain Proof (Ethereum Sepolia)
Every verification result is **SHA-256 fingerprinted** and permanently written to the Ethereum Sepolia blockchain via a Solidity smart contract. Once stored, the record cannot be altered — providing tamper-proof, auditable evidence.

### 🛰️ Satellite Data Integration
Cross-references project boundaries with real-time **NDVI (Normalized Difference Vegetation Index)** satellite imagery to monitor deforestation and vegetation health in carbon project zones.

### 📊 Real-Time Dashboard
Beautiful, interactive data visualizations built with **Recharts** and **shadcn/ui** — live risk scores, verification history, and trend analytics in a stunning dark-theme interface.

### 🗄️ Serverless Database
Uses **Neon Serverless PostgreSQL** with **Drizzle ORM** for robust, scalable data persistence with type-safe queries.

---

## 🧪 Automated Testing & Verification

VerdaChain includes automated verification suites for the AI risk scoring engine, mock registry integrity, and credit fraud evaluation:

```bash
# Run backend verifier test suite
python verdachain-backend/test_verifier.py

# Or via npm
npm test
```

### Test Coverage Highlights:
- **Unknown Certificate Detection (`test_01`)**: Rejects unregistered credit certificates with a 95 risk score and `HIGH RISK` designation.
- **Overissuance & Deforestation Detection (`test_02`)**: Detects credits exceeding baseline issuance (>150%) and flags severe deforestation (>20%).
- **Clean Credit Verification (`test_03`)**: Validates genuine verified projects with 0 conflicts and awards `LOW RISK` status (score <= 30).
- **Multi-Vector Conflict Scoring (`test_04`)**: Tests compound risk scenarios across cross-registry conflicts and issuer history flags.
- **Registry Schema Integrity (`test_05`)**: Enforces required metadata schema across all registered credit assets.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, Framer Motion |
| UI Components | shadcn/ui, Recharts, Lucide Icons |
| Backend | Next.js Server Actions |
| Database | Neon Serverless PostgreSQL, Drizzle ORM |
| Blockchain | Solidity (Smart Contract), Ethers.js, Ethereum Sepolia Testnet |
| AI Backend | Python (FastAPI/Flask), ML Risk Engine |
| Deployment | Vercel |

---

## 🚀 Getting Started

> **Try it live:** [veda-chain-rosy.vercel.app](https://veda-chain-rosy.vercel.app/)

### Prerequisites
- Node.js v18+
- Python 3.9+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/LAKSHYA-NIGAM/VerdaChain.git
cd veda-Chain

# Install frontend dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Add the following to your `.env` file:

```env
# Neon PostgreSQL Database URL
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Python AI Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🔗 How The Blockchain Verification Works

```
Carbon Credit Data
        │
        ▼
AI Risk Engine (Python)
  └── 15+ risk vectors analyzed
  └── Score generated (0-100)
        │
        ▼
SHA-256 Fingerprint
        │
        ▼
Solidity Smart Contract
  └── Written to Ethereum Sepolia
  └── Immutable on-chain record
        │
        ▼
Tamper-Proof Verification Certificate
```

---

## 📂 Project Structure

```
VerdaChain/
├── app/                 # Next.js 15 App Router
│   ├── page.tsx         # Landing page
│   ├── dashboard/       # Analytics dashboard
│   └── verify/          # Verification flow
├── components/          # shadcn/ui + custom components
├── lib/
│   ├── db/              # Drizzle ORM + Neon config
│   ├── blockchain/      # Ethers.js + contract ABIs
│   └── actions/         # Next.js Server Actions
├── contracts/           # Solidity smart contracts
└── python_backend/      # FastAPI AI risk engine
```

---

## 🏆 Recognition

- 🥈 **Hackstacy 2.0 Finalist** — Top 12 out of 400+ competing teams nationwide
- Built end-to-end with blockchain + AI + satellite data integration

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/LAKSHYA-NIGAM">Lakshya Nigam</a>
<br/>
<a href="https://veda-chain-rosy.vercel.app/">veda-chain-rosy.vercel.app</a>
</div>
