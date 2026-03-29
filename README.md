# VerdaChain – The Carbon Credit Lie Detector

**Live Demo:** [https://veda-chain.vercel.app](https://veda-chain.vercel.app) *(Update this link to your actual deployed URL if different)*

VerdaChain is a premium, full-stack SaaS application designed to verify carbon credits instantly using an AI-powered risk engine and blockchain-backed transparency. It helps investors and organizations detect carbon credit fraud and greenwashing before it hits the market.

## ✨ Core Features

- **🧠 AI Verification Engine**: A multi-layer machine learning risk engine that cross-checks 15+ independent risk vectors for every carbon credit submitted. It analyzes registry conflicts, issuer history, MRV methodology audits, and scores credits from 0-100.
- **🔗 On-chain Proof (Ethereum Sepolia)**: Every verification result is SHA-256 fingerprinted and permanently written to the Ethereum Sepolia blockchain via a smart contract. Once stored, the record cannot be altered, providing tamper-proof evidence.
- **🛰️ Satellite Data Integration**: Cross-references project boundaries with real-time NDVI (Normalized Difference Vegetation Index) satellite imagery to monitor deforestation and vegetation health.
- **⚡ Modern Tech Stack**: Built with Next.js 15, React 19, Tailwind CSS 4, and Framer Motion for a stunning, interactive dark-theme user interface.
- **📊 Real-time Dashboard**: Features beautiful, interactive data visualizations using Recharts and shadcn/ui.
- **🗄️ Database**: Uses Neon Serverless PostgreSQL with Drizzle ORM for robust data persistence.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Recharts, shadcn/ui, Lucide Icons
- **Backend/Database**: Next.js Server Actions, Neon PostgreSQL, Drizzle ORM
- **Blockchain**: Ethers.js, Solidity (Sepolia Testnet)
- **AI Backend**: Python (FastAPI/Flask integration)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and `npm` installed.

### 1. Clone the repository

```bash
git clone https://github.com/LAKSHYA-NIGAM/VerdaChain.git
cd veda-Chain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following:

```env
# Neon PostgreSQL Database URL
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Python AI Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

The easiest way to deploy the Next.js frontend is to use [Vercel](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Configure the `DATABASE_URL` and `NEXT_PUBLIC_BACKEND_URL` in the Vercel project environment variables.
4. Deploy!

## 📄 License
This project is licensed under the MIT License.
