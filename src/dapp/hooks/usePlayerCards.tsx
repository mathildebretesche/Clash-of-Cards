import { useSuiClientQuery } from '@mysten/dapp-kit'
import { CONTRACT_PACKAGE_VARIABLE_NAME } from '~~/config/network'
import { fullStructName } from '~~/helpers/network'
import useNetworkConfig from '~~/hooks/useNetworkConfig'

const usePlayerCards = (address: string | undefined) => {
    const { useNetworkVariable } = useNetworkConfig()
    const packageId = useNetworkVariable(CONTRACT_PACKAGE_VARIABLE_NAME)

    return useSuiClientQuery('getOwnedObjects', {
        owner: address as string,
        limit: 50,
        filter: {
            StructType: fullStructName(packageId, 'Card'),
        },
        options: {
            showContent: true,
            showDisplay: true,
        },
    }, {
        enabled: !!address
    })
}

export default usePlayerCards
