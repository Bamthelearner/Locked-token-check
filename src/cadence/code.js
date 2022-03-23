

export const script = `
import NonFungibleToken from 0x1d7e57aa55817448
import BloctoPass from 0x0f9df91c9121c460

pub fun main( addr: Address) : [UFix64] {

  let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic, BloctoPass.CollectionPublic}>(BloctoPass.CollectionPublicPath)
            .borrow() ?? return[]
  
  let ids = ref.getIDs()
  let length = UInt64(ref.getIDs().length) - 1
  let id = ids[length]

  let passRef = ref.borrowBloctoPassPublic(id: id)
  let lockupSchedule = passRef.getLockupSchedule()
  let lockupAmount = passRef.getLockupAmountAtTimestamp(timestamp: 0.0)

  // Function to decode the unlocking schedule and amount
  let timestamp = getCurrentBlock().timestamp
  let keys = lockupSchedule.keys
  var closestTimestamp = UFix64.max
  var lockupPercentage = UFix64.max

  for key in keys {
    if timestamp <= key && key <= closestTimestamp {
        lockupPercentage = lockupSchedule[key]!
        closestTimestamp = key
    }
  }

  var lastclosestTimestamp = 0.0
  var lastlockupPercentage = 0.0

  for key in keys {
      if timestamp >= key && key >= lastclosestTimestamp {
          lastlockupPercentage = lockupSchedule[key]!
          lastclosestTimestamp = key
      }
  }

  let amount = lockupAmount * (lastlockupPercentage - lockupPercentage)


  return [closestTimestamp , amount]

} 
`