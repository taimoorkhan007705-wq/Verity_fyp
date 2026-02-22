import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, CheckCircle } from 'lucide-react'
import { getFeed } from '../../services/api'
import Stories from '../story/Stories'
import {
  FeedContainer,
  StoriesContainer,
  CreateStoryCard,
  CreateStoryIcon,
  CreateStoryText,
  PostCard,
  PostHeader,
  PostAvatar,
  PostUserInfo,
  PostUserName,
  VerifiedBadge,
  PostUsername,
  PostTime,
  PostText,
  PostHashtag,
  PostImage,
  PostActions,
  ActionButton,
} from './Feed.styled'
function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadFeed()
  }, [])
  const loadFeed = async () => {
    try {
      const response = await getFeed()
      console.log('Feed response:', response)
      console.log('Posts:', response.posts)
      response.posts.forEach((post, idx) => {
        console.log(`Post ${idx + 1} author:`, post.author)
        console.log(`Post ${idx + 1} avatar nested:`, post.author?.profile_info?.avatar)
        console.log(`Post ${idx + 1} avatar flat:`, post.author?.avatar)
        const avatarUrl = post.author?.profile_info?.avatar 
          ? (post.author.profile_info.avatar.startsWith('http') 
              ? post.author.profile_info.avatar 
              : `http://localhost:5000${post.author.profile_info.avatar}`)
          : post.author?.avatar
          ? (post.author.avatar.startsWith('http') 
              ? post.author.avatar 
              : `http://localhost:5000${post.author.avatar}`)
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.user_info?.fullName || post.author?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
        console.log(`Post ${idx + 1} final avatar URL:`, avatarUrl)
      })
      setPosts(response.posts)
    } catch (error) {
      console.error('Failed to load feed:', error)
    } finally {
      setLoading(false)
    }
  }
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }
  if (loading) {
    return (
      <FeedContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Loading feed...
        </div>
      </FeedContainer>
    )
  }
  return (
    <FeedContainer>
      {}
      <Stories />
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No posts yet</p>
          <p>Be the first to create a post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id}>
            <PostHeader>
              <PostAvatar 
                src={
                  post.author?.profile_info?.avatar 
                    ? (post.author.profile_info.avatar.startsWith('http') 
                        ? post.author.profile_info.avatar 
                        : `http://localhost:5000${post.author.profile_info.avatar}`)
                    : post.author?.avatar
                    ? (post.author.avatar.startsWith('http') 
                        ? post.author.avatar 
                        : `http://localhost:5000${post.author.avatar}`)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.user_info?.fullName || post.author?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
                } 
                alt={post.author?.user_info?.fullName || post.author?.fullName} 
              />
              <PostUserInfo>
                <PostUserName>
                  <span data-author-id={post.author?._id}>
                    {post.author?.user_info?.fullName || post.author?.fullName}
                  </span>
                  {post.isVerified && <VerifiedBadge><CheckCircle size={14} /></VerifiedBadge>}
                </PostUserName>
                <PostUsername>
                  @{post.author?.email?.split('@')[0]}
                  <PostTime>{formatTime(post.createdAt)}</PostTime>
                </PostUsername>
              </PostUserInfo>
            </PostHeader>
            <PostText>
              {post.content.split('#').map((part, index) => {
                if (index === 0) return part
                const [hashtag, ...rest] = part.split(' ')
                return (
                  <span key={index}>
                    <PostHashtag>#{hashtag}</PostHashtag> {rest.join(' ')}
                  </span>
                )
              })}
            </PostText>
            {post.media && post.media.length > 0 && (
              <div>
                {post.media.map((item, idx) => (
                  item.type === 'image' ? (
                    <PostImage key={idx} src={`http://localhost:5000${item.url}`} alt="Post media" />
                  ) : (
                    <video key={idx} controls style={{ width: '100%', borderRadius: '12px', marginTop: '1rem' }}>
                      <source src={`http://localhost:5000${item.url}`} type="video/mp4" />
                    </video>
                  )
                ))}
              </div>
            )}
            <PostActions>
              <ActionButton>
                <Heart />
                {post.likes?.length || 0}
              </ActionButton>
              <ActionButton>
                <MessageCircle />
                {post.comments?.length || 0}
              </ActionButton>
              <ActionButton>
                <Share2 />
                {post.shares || 0}
              </ActionButton>
            </PostActions>
          </PostCard>
        ))
      )}
    </FeedContainer>
  )
}
export default Feed
