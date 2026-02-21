import { CheckCircle, X } from 'lucide-react'
import {
  ReviewCard as StyledReviewCard,
  ReviewCardHeader,
  AuthorInfo,
  AuthorAvatar,
  AuthorDetails,
  AuthorName,
  AuthorMeta,
  PostContent,
  PostText,
  PostImage,
  ActionButtonsRow,
  ApproveButton,
  RejectButton,
} from '../ReviewCenter.styled'

function ReviewCard({ post, onApprove, onReject }) {
  return (
    <StyledReviewCard>
      {/* Header */}
      <ReviewCardHeader>
        <AuthorInfo>
          <AuthorAvatar src={post.author.avatar} alt={post.author.name} />
          <AuthorDetails>
            <AuthorName>{post.author.name}</AuthorName>
            <AuthorMeta>
              Trust Score: {post.author.trustScore}% • {post.author.postsCount} posts • {post.timestamp}
            </AuthorMeta>
          </AuthorDetails>
        </AuthorInfo>
      </ReviewCardHeader>

      {/* Post Content */}
      <PostContent>
        <PostText>{post.text}</PostText>
        {console.log('Post ID:', post.id, 'Image URL:', post.image)}
        {post.image ? (
          <PostImage 
            src={post.image} 
            alt="Post content" 
            onError={(e) => console.error('Image failed to load:', post.image, e)} 
          />
        ) : (
          <div style={{padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', color: '#dc2626'}}>
            No image attached to this post
          </div>
        )}
      </PostContent>

      {/* Status Badge for reviewed posts */}
      {post.status !== 'pending' && (
        <div style={{
          padding: '0.75rem',
          background: post.status === 'approved' ? '#d1fae5' : post.status === 'rejected' ? '#fee2e2' : '#fef3c7',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            fontWeight: 600,
            color: post.status === 'approved' ? '#059669' : post.status === 'rejected' ? '#dc2626' : '#d97706',
            marginBottom: '0.25rem'
          }}>
            {post.status === 'approved' && '✓ Approved'}
            {post.status === 'rejected' && '✕ Rejected'}
            {post.status === 'flagged' && '⚑ Flagged'}
          </div>
          <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
            {post.reviewedAt}
          </div>
          {post.rejectReason && (
            <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#374151'}}>
              <strong>Reason:</strong> {post.rejectReason}
              {post.rejectNotes && <div><strong>Notes:</strong> {post.rejectNotes}</div>}
            </div>
          )}
          {post.flagReason && (
            <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#374151'}}>
              <strong>Reason:</strong> {post.flagReason}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons - Only show for pending posts */}
      {post.status === 'pending' && (
        <ActionButtonsRow>
          <ApproveButton onClick={() => onApprove(post.id)}>
            <CheckCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Approve
          </ApproveButton>
          <RejectButton onClick={() => onReject(post)}>
            <X size={18} /> Reject
          </RejectButton>
        </ActionButtonsRow>
      )}
    </StyledReviewCard>
  )
}

export default ReviewCard
