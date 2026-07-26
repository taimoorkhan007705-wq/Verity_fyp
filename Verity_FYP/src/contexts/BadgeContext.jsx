/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { API_URL } from '../config.js'
import { isAuthenticated } from '../services/api'
import { useToast } from './ToastContext'

const BadgeContext = createContext()

const FEED_VISIT_KEY = 'feedLastVisitedAt'
const SEEN_NOTIF_KEY = 'seenNotificationIds'

export const useBadges = () => {
  const context = useContext(BadgeContext)
  if (!context) {
    throw new Error('useBadges must be used within BadgeProvider')
  }
  return context
}

const getFeedSince = () => localStorage.getItem(FEED_VISIT_KEY) || new Date(0).toISOString()

const getSeenIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_NOTIF_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

const saveSeenIds = (ids) => {
  const arr = [...ids].slice(-100)
  localStorage.setItem(SEEN_NOTIF_KEY, JSON.stringify(arr))
}

export function BadgeProvider({ children }) {
  const toast = useToast()
  const [badges, setBadges] = useState({
    unreadMessages: 0,
    unreadRejections: 0,
    newFeedAuthors: 0,
  })
  const prevMessageCount = useRef(0)
  const seenNotifIds = useRef(getSeenIds())
  const notifInitialized = useRef(false)

  const fetchBadges = useCallback(async () => {
    if (!isAuthenticated()) return

    const token = localStorage.getItem('token')
    const feedSince = getFeedSince()

    try {
      const res = await fetch(`${API_URL}/users/badges?feedSince=${encodeURIComponent(feedSince)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        const { unreadMessages, unreadRejections, newFeedAuthors } = data.badges

        if (unreadMessages > prevMessageCount.current && prevMessageCount.current > 0) {
          toast.info('New message received')
        }
        prevMessageCount.current = unreadMessages

        setBadges({ unreadMessages, unreadRejections, newFeedAuthors })
      }
    } catch (err) {
      console.error('Failed to fetch badges:', err)
    }
  }, [toast])

  const pollNotifications = useCallback(async () => {
    if (!isAuthenticated()) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) return

      if (!notifInitialized.current) {
        for (const notif of data.notifications) {
          seenNotifIds.current.add(notif._id)
        }
        saveSeenIds(seenNotifIds.current)
        notifInitialized.current = true
        return
      }

      const idsToMarkRead = []
      for (const notif of data.notifications) {
        const id = notif._id
        if (seenNotifIds.current.has(id)) continue

        seenNotifIds.current.add(id)

        if (notif.type === 'post_approved') {
          toast.success(notif.message || 'Your post has been approved!')
          idsToMarkRead.push(id)
        } else if (notif.type === 'post_rejected') {
          toast.error(notif.message || 'Your post was rejected')
        } else if (notif.type === 'message') {
          toast.info('New message received')
          idsToMarkRead.push(id)
        }
      }

      if (idsToMarkRead.length) {
        saveSeenIds(seenNotifIds.current)
        await fetch(`${API_URL}/users/notifications/read`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: idsToMarkRead }),
        })
      }
    } catch (err) {
      console.error('Failed to poll notifications:', err)
    }
  }, [toast])

  const markFeedVisited = useCallback(() => {
    localStorage.setItem(FEED_VISIT_KEY, new Date().toISOString())
    setBadges(prev => ({ ...prev, newFeedAuthors: 0 }))
    fetchBadges()
  }, [fetchBadges])

  const markRejectionsVisited = useCallback(async () => {
    if (!isAuthenticated()) return

    const token = localStorage.getItem('token')
    try {
      await fetch(`${API_URL}/users/badges/rejections/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      setBadges(prev => ({ ...prev, unreadRejections: 0 }))
    } catch (err) {
      console.error('Failed to mark rejections read:', err)
    }
  }, [])

  const refreshBadges = useCallback(() => {
    fetchBadges()
  }, [fetchBadges])

  useEffect(() => {
    if (!isAuthenticated()) return

    fetchBadges()
    pollNotifications()

    const interval = setInterval(() => {
      fetchBadges()
      pollNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchBadges, pollNotifications])

  return (
    <BadgeContext.Provider
      value={{
        badges,
        markFeedVisited,
        markRejectionsVisited,
        refreshBadges,
      }}
    >
      {children}
    </BadgeContext.Provider>
  )
}

