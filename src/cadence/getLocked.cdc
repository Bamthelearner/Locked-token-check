import NonFungibleToken from 0x1d7e57aa55817448
import BloctoPass from 0x0f9df91c9121c460

pub fun main(Addr: Address) : UFix64  {

  let ref = getAccount(Addr).getCapability<&{NonFungibleToken.CollectionPublic, BloctoPass.CollectionPublic}>(BloctoPass.CollectionPublicPath)
            .borrow() ?? panic ("You dont have a Blocto Pass")
  
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

  closestTimestamp = 0.0
  var lastlockupPercentage = 0.0

  for key in keys {
      if timestamp >= key && key >= closestTimestamp {
          lastlockupPercentage = lockupSchedule[key]!
          closestTimestamp = key
      }
  }

  let amount = lockupAmount * (lastlockupPercentage - lockupPercentage)

  return amount

} 