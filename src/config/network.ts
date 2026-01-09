// We automatically create/update .env.local with the deployed package ID after deployment.
export const CONTRACT_PACKAGE_ID_NOT_DEFINED = '0xNOTDEFINED'
export const LOCALNET_CONTRACT_PACKAGE_ID =
  import.meta.env.VITE_LOCALNET_CONTRACT_PACKAGE_ID ||
  CONTRACT_PACKAGE_ID_NOT_DEFINED
export const DEVNET_CONTRACT_PACKAGE_ID =
  import.meta.env.VITE_DEVNET_CONTRACT_PACKAGE_ID ||
  CONTRACT_PACKAGE_ID_NOT_DEFINED
export const MAINNET_CONTRACT_PACKAGE_ID =
  import.meta.env.VITE_MAINNET_CONTRACT_PACKAGE_ID ||
  CONTRACT_PACKAGE_ID_NOT_DEFINED

export const LOCALNET_EXPLORER_URL = 'http://localhost:9001'
export const DEVNET_EXPLORER_URL = 'https://devnet.suivision.xyz'
export const TESTNET_EXPLORER_URL = 'https://testnet.suivision.xyz'
export const MAINNET_EXPLORER_URL = 'https://suivision.xyz'

export const CONTRACT_PACKAGE_VARIABLE_NAME = 'contractPackageId'

export const EXPLORER_URL_VARIABLE_NAME = 'explorerUrl'

export const NETWORKS_WITH_FAUCET = ['localnet', 'devnet', 'testnet']

export const TESTNET_CONTRACT_PACKAGE_ID = '0x1e4fdc12b9db1c79cf358859470a6895ca4a2a3671d56f10a409543f773939d5'
export const ENNEMY_PLAYER_ADRESS = '0xd251b46121aebadf3d451e77ce7cc43b3c0d5e9d3ed1575d12af8491a835748a'
