import {
  supportedChains,
  defaultChain,
  getChainById,
  getChainByName,
  isChainSupported,
  getExplorerAddressUrl,
  getExplorerTxUrl,
  getChainCurrencySymbol,
  getChainName,
  getChainMetadata,
} from '@/config/chains'

describe('Config - Chains', () => {
  describe('supportedChains', () => {
    it('should contain supported chains', () => {
      expect(supportedChains.length).toBeGreaterThan(0)
    })

    it('should have unique chain IDs', () => {
      const ids = supportedChains.map(chain => chain.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })
  })

  describe('defaultChain', () => {
    it('should be defined', () => {
      expect(defaultChain).toBeDefined()
      expect(defaultChain.id).toBeDefined()
      expect(defaultChain.name).toBeDefined()
    })
  })

  describe('getChainById', () => {
    it('should return chain by ID', () => {
      const chain = getChainById(defaultChain.id)
      expect(chain).toBeDefined()
      expect(chain?.id).toBe(defaultChain.id)
    })

    it('should return undefined for unknown chain ID', () => {
      const chain = getChainById(999999)
      expect(chain).toBeUndefined()
    })
  })

  describe('getChainByName', () => {
    it('should return chain by name', () => {
      const chain = getChainByName(defaultChain.name)
      expect(chain).toBeDefined()
      expect(chain?.name.toLowerCase()).toBe(defaultChain.name.toLowerCase())
    })

    it('should be case-insensitive', () => {
      const chain = getChainByName(defaultChain.name.toUpperCase())
      expect(chain).toBeDefined()
    })

    it('should return undefined for unknown chain name', () => {
      const chain = getChainByName('UnknownChain')
      expect(chain).toBeUndefined()
    })
  })

  describe('isChainSupported', () => {
    it('should return true for supported chains', () => {
      expect(isChainSupported(defaultChain.id)).toBe(true)
    })

    it('should return false for unsupported chains', () => {
      expect(isChainSupported(999999)).toBe(false)
    })
  })

  describe('getExplorerAddressUrl', () => {
    it('should return explorer URL for address', () => {
      const url = getExplorerAddressUrl(
        defaultChain.id,
        '0x0000000000000000000000000000000000000000'
      )
      expect(url).toContain('address')
      expect(url).toContain('0x0000000000000000000000000000000000000000')
    })

    it('should return null for unsupported chain', () => {
      const url = getExplorerAddressUrl(999999, '0x0000000000000000000000000000000000000000')
      expect(url).toBeNull()
    })
  })

  describe('getExplorerTxUrl', () => {
    it('should return explorer URL for transaction', () => {
      const url = getExplorerTxUrl(
        defaultChain.id,
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )
      expect(url).toContain('tx')
    })
  })

  describe('getChainCurrencySymbol', () => {
    it('should return currency symbol', () => {
      const symbol = getChainCurrencySymbol(defaultChain.id)
      expect(symbol).toBeDefined()
      expect(typeof symbol).toBe('string')
    })

    it('should return ETH for unknown chains', () => {
      const symbol = getChainCurrencySymbol(999999)
      expect(symbol).toBe('ETH')
    })
  })

  describe('getChainName', () => {
    it('should return chain name', () => {
      const name = getChainName(defaultChain.id)
      expect(name).toBe(defaultChain.name)
    })

    it('should return Unknown Chain for unknown chains', () => {
      const name = getChainName(999999)
      expect(name).toBe('Unknown Chain')
    })
  })

  describe('getChainMetadata', () => {
    it('should return chain metadata', () => {
      const metadata = getChainMetadata(defaultChain.id)
      expect(metadata).toBeDefined()
      expect(metadata?.id).toBe(defaultChain.id)
      expect(metadata?.name).toBeDefined()
      expect(metadata?.color).toBeDefined()
    })

    it('should return null for unknown chains', () => {
      const metadata = getChainMetadata(999999)
      expect(metadata).toBeNull()
    })
  })
})
