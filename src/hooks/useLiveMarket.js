import { useQuery } from '@tanstack/react-query'
import { getNiftyLive } from '../api/liveData'

export function useLiveMarket() {
  // IST time check: market open 9:15-15:30 IST Mon-Fri
  const isMarketOpen = () => {
    const now = new Date()
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const day = ist.getDay() // 0=Sun, 6=Sat
    const hour = ist.getHours()
    const min = ist.getMinutes()
    const totalMin = hour * 60 + min
    return day >= 1 && day <= 5 && totalMin >= 555 && totalMin <= 930
    // 555 = 9:15 AM, 930 = 15:30 PM
  }

  const isOpen = isMarketOpen()

  const { data: niftyData, isLoading } = useQuery({
    queryKey: ['nifty-live'],
    queryFn: getNiftyLive,
    refetchInterval: isOpen ? 60000 : false, // Poll every 60s during market hours
    staleTime: 30000,
  })

  return { niftyData, isMarketOpen: isOpen, isLoading }
}
