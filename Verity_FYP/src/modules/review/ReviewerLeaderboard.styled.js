import styled from 'styled-components'

export const LeaderboardContainer = styled.div`
  padding: 2rem;
  backgroundColor: #f8fafc;
  minHeight: 100vh;
  maxWidth: 1400px;
  margin: 0 auto;
`

export const HeaderSection = styled.div`
  display: flex;
  alignItems: flex-start;
  justifyContent: space-between;
  marginBottom: 2rem;
  backgroundColor: white;
  padding: 2rem;
  borderRadius: 1rem;
  boxShadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flexDirection: column;
    gap: 1.5rem;
  }
`

export const HeaderIcon = styled.div`
  display: flex;
  alignItems: center;
  justifyContent: center;
  width: 72px;
  height: 72px;
  backgroundColor: #f0fdfa;
  borderRadius: 0.75rem;
  flexShrink: 0;
`

export const HeaderTitle = styled.h1`
  fontSize: 2rem;
  fontWeight: 900;
  color: #1f2937;
  margin: 0;
`

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  marginBottom: 2rem;
  flexWrap: wrap;

  @media (max-width: 768px) {
    flexDirection: column;
  }
`

export const FilterButton = styled.button`
  display: flex;
  alignItems: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  borderRadius: 0.5rem;
  border: 2px solid #e2e8f0;
  backgroundColor: ${props => props.$isActive ? '#f0fdfa' : 'white'};
  color: ${props => props.$isActive ? '#14b8a6' : '#64748b'};
  fontWeight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    backgroundColor: #f0fdfa;
    borderColor: #14b8a6;
    color: #14b8a6;
  }
`

export const LeaderboardGrid = styled.div`
  display: grid;
  gridTemplateColumns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    gridTemplateColumns: 1fr;
  }
`

export const LeaderboardCard = styled.div`
  backgroundColor: white;
  borderRadius: 1rem;
  padding: 1.5rem;
  boxShadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    boxShadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    backgroundColor: #14b8a6;
  }
`

export const RankBadge = styled.div`
  display: flex;
  alignItems: center;
  gap: 0.5rem;
  marginBottom: 1rem;
  padding: 0.75rem 1rem;
  backgroundColor: ${props => {
    if (props.$rank === 1) return '#fef3c7'
    if (props.$rank === 2) return '#f3f4f6'
    if (props.$rank === 3) return '#fed7aa'
    return '#f0fdfa'
  }};
  borderRadius: 0.5rem;
  fontWeight: 900;
  color: ${props => {
    if (props.$rank === 1) return '#d97706'
    if (props.$rank === 2) return '#6b7280'
    if (props.$rank === 3) return '#ea580c'
    return '#14b8a6'
  }};
`

export const ReviewerHeader = styled.div`
  display: flex;
  gap: 1rem;
  alignItems: flex-start;
  marginBottom: 1.5rem;
`

export const ReviewerInfo = styled.div`
  flex: 1;
`

export const ReviewerDetails = styled.div`
  flex: 1;
  minWidth: 0;
`

export const ReviewerName = styled.h3`
  fontSize: 1.125rem;
  fontWeight: 900;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  wordBreak: break-word;
`

export const ReviewerRole = styled.p`
  fontSize: 0.875rem;
  color: #64748b;
  margin: 0;
  fontWeight: 600;
`

export const ScoreSection = styled.div`
  marginBottom: 1.5rem;
`

export const ScoreBadge = styled.div`
  padding: 1.25rem;
  backgroundColor: ${props => props.$color}14;
  borderRadius: 0.75rem;
  borderLeft: 4px solid ${props => props.$color};
  display: flex;
  flexDirection: column;
  alignItems: center;
  gap: 0.25rem;
`

export const ScoreValue = styled.div`
  fontSize: 2rem;
  fontWeight: 900;
  color: ${props => props.color || '#14b8a6'};
`

export const ScoreLabel = styled.div`
  fontSize: 0.75rem;
  fontWeight: 600;
  color: #64748b;
  textTransform: uppercase;
  letterSpacing: 0.5px;
`

export const StatsGrid = styled.div`
  display: grid;
  gridTemplateColumns: repeat(2, 1fr);
  gap: 1rem;
  marginBottom: 1rem;
`

export const StatItem = styled.div`
  display: flex;
  flexDirection: column;
  alignItems: center;
  gap: 0.5rem;
  padding: 1rem;
  backgroundColor: #f8fafc;
  borderRadius: 0.5rem;
  textAlign: center;

  &:hover {
    backgroundColor: #f0fdfa;
  }
`

export const StatIcon = styled.div`
  display: flex;
  alignItems: center;
  justifyContent: center;
`

export const StatValue = styled.div`
  fontSize: 1.5rem;
  fontWeight: 900;
  color: #1f2937;
`

export const StatLabel = styled.div`
  fontSize: 0.75rem;
  fontWeight: 600;
  color: #64748b;
  textTransform: uppercase;
`

export const SpecializationTag = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  backgroundColor: #f0fdfa;
  color: #14b8a6;
  borderRadius: 0.375rem;
  fontSize: 0.75rem;
  fontWeight: 600;
`

export const EmptyState = styled.div`
  display: flex;
  flexDirection: column;
  alignItems: center;
  justifyContent: center;
  padding: 4rem 2rem;
  backgroundColor: white;
  borderRadius: 1rem;
  boxShadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 1rem;
  color: #cbd5e1;
  fontSize: 1.125rem;
  fontWeight: 600;
`

export const LoadingState = styled.div`
  display: flex;
  alignItems: center;
  justifyContent: center;
  minHeight: 100vh;
  backgroundColor: #f8fafc;
  fontSize: 1.125rem;
  color: #64748b;
  fontWeight: 600;
`
