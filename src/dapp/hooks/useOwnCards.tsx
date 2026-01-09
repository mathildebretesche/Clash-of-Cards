import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { CONTRACT_PACKAGE_VARIABLE_NAME } from '~~/config/network'
import { fullStructName } from '~~/helpers/network'
import useNetworkConfig from '~~/hooks/useNetworkConfig'

const useOwnCards = () => {
    const currentAccount = useCurrentAccount()
    const { useNetworkVariable } = useNetworkConfig()
    const packageId = useNetworkVariable(CONTRACT_PACKAGE_VARIABLE_NAME)

    return useSuiClientQuery('getOwnedObjects', {
        owner: currentAccount?.address as string,
        limit: 50,
        filter: {
            StructType: fullStructName(packageId, 'Card'),
        },
        options: {
            showContent: true,
            showDisplay: true,
        },
    })
}

export default useOwnCards
