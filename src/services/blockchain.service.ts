import type { VoteTally, BlockchainVoteResult, VoteOptionId } from '@/types/index'

// TODO: installer ethers.js → npm install ethers@^6
// import { ethers } from 'ethers'
// import EarthChainABI from '@/config/earthchain.abi.json'
// import { CONTRACTS } from '@/config/contracts'

export const BlockchainService = {
  // TODO: typer avec ethers.BrowserProvider / Signer / Contract une fois ethers.js installé
  provider: null as unknown,
  signer: null as unknown,
  contract: null as unknown,

  async connectWallet(): Promise<string> {
    // TODO:
    // if (!window.ethereum) throw new Error('Aucun wallet détecté. Installez MetaMask.')
    // this.provider = new ethers.BrowserProvider(window.ethereum)
    // this.signer = await this.provider.getSigner()
    // this.contract = new ethers.Contract(CONTRACTS.polygon.earthChain, EarthChainABI, this.signer)
    // return await this.signer.getAddress()
    console.warn('[BlockchainService] connectWallet — non implémenté (stub)')
    return '0xDEMO…0000'
  },

  async castVote(_decisionId: string, _optionId: VoteOptionId): Promise<BlockchainVoteResult> {
    // TODO: const tx = await this.contract.castVote(_decisionId, _optionId)
    // const receipt = await tx.wait()
    // return { hash: receipt.hash, blockNumber: receipt.blockNumber }
    console.warn('[BlockchainService] castVote — non implémenté (stub)')
    const fakeHash = '0x' + Math.random().toString(16).slice(2, 10) + '…' + Math.random().toString(16).slice(2, 6)
    return { hash: fakeHash, blockNumber: 1848 }
  },

  async getVoteTally(_decisionId: string): Promise<VoteTally> {
    // TODO: const [pour, contre, abst] = await this.contract.getVoteTally(_decisionId)
    console.warn('[BlockchainService] getVoteTally — non implémenté (stub)')
    return { pour: 673, contre: 386, abst: 188 }
  },

  async validateDecision(_decisionId: string): Promise<{ hash: string }> {
    // TODO: const tx = await this.contract.validateDecision(_decisionId)
    console.warn('[BlockchainService] validateDecision — non implémenté (stub)')
    return { hash: '0x' + Math.random().toString(16).slice(2, 10) + '…' + Math.random().toString(16).slice(2, 6) }
  },

  subscribeToVotes(_decisionId: string, _onVote: (event: unknown) => void): void {
    // TODO: this.contract.on('VoteCast', (voter, dId, option, event) => { if (dId === _decisionId) _onVote(event) })
    console.warn('[BlockchainService] subscribeToVotes — non implémenté (stub)')
  },

  unsubscribeAll(): void {
    // TODO: this.contract?.removeAllListeners()
  },
}
