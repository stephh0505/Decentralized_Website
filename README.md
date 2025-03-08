# GhostFund

GhostFund is an anonymous crowdfunding platform built on blockchain technology, allowing users to create and fund projects with enhanced privacy features.

## Features

- **Anonymous Crowdfunding**: Create and fund projects without revealing your identity
- **Blockchain-Powered**: Built on Ethereum for transparent and secure transactions
- **Privacy-Enhanced**: Uses zero-knowledge proofs and Tor routing for maximum privacy
- **AI-Enhanced**: Integrated AI tools to evaluate project legitimacy and provide suggestions

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Next.js, Tailwind CSS
- **Blockchain**: Ethereum, Solidity, Hardhat
- **Privacy**: Tor, Zero-Knowledge Proofs
- **AI**: Perplexity API integration

## Project Structure

```
GhostFund/
│── backend/                     # Node.js & Express backend
│   │── controllers/             # Business logic
│   │── models/                  # Database models
│   │── routes/                  # API routes
│   │── services/                # External services (AI, blockchain)
│   │── config/                  # Config files
│   │── scripts/                 # Hardhat scripts
│   │── .env                     # Environment variables
│   │── server.js                # Main Express.js backend
│
│── frontend/                    # React/Next.js frontend
│   │── components/              # Reusable UI components
│   │── pages/                   # Next.js pages
│   │── styles/                  # CSS & Tailwind styles
│   │── utils/                   # Helper functions
│   │── next.config.js           # Next.js config
│
│── contracts/                   # Solidity smart contracts
│   │── GhostFund.sol            # Main funding contract
│   │── Mixers.sol               # Privacy-enhancing mixer
│
│── tor/                         # Tor hidden service setup
│   │── torrc                    # Tor configuration file
│   │── start-tor.sh             # Script to start Tor service
│
│── scripts/                     # Deployment & testing scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- Ethereum wallet (MetaMask recommended)
- Tor (optional, for enhanced privacy)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ghostfund.git
   cd ghostfund
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Fill in the required environment variables

4. Start the development servers:
   ```
   # Start both backend and frontend
   cd ..
   bash scripts/start.sh dev
   ```

### Deployment

#### Smart Contracts

1. Deploy the smart contracts to the Ethereum network:
   ```
   cd backend
   npm run deploy
   ```

2. Update the contract addresses in your `.env` file

#### Tor Hidden Service (Optional)

1. Set up the Tor hidden service:
   ```
   cd tor
   sudo bash start-tor.sh
   ```

2. Add the onion address to your `.env` file

## Usage

### Creating a Project

1. Connect your Ethereum wallet
2. Navigate to "Create Project"
3. Fill in the project details
4. Choose privacy settings
5. Submit the project

### Funding a Project

1. Browse available projects
2. Select a project to fund
3. Choose funding amount
4. Select privacy level (anonymous or public)
5. Complete the transaction

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ethereum](https://ethereum.org/)
- [Tornado Cash](https://tornado.cash/) (inspiration for the mixer contract)
- [Perplexity AI](https://www.perplexity.ai/)
- [The Tor Project](https://www.torproject.org/) 