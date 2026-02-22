import styled from 'styled-components'
export const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
`
export const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`
export const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`
export const DashboardSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`
export const TopReviewersSection = styled.div`
  background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%);
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
  h3 {
    color: white;
  }
`
export const TopReviewerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(5px);
  }
  &:last-child {
    margin-bottom: 0;
  }
`
export const TopReviewerRank = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`
export const TopReviewerAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
  flex-shrink: 0;
`
export const TopReviewerDetails = styled.div`
  flex: 1;
`
export const TopReviewerName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`
export const TopReviewerScore = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$color || '#fff'};
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  display: inline-block;
`
export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`
export const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid ${props => props.$isActive ? '#14b8a6' : '#e5e7eb'};
  background-color: ${props => props.$isActive ? '#14b8a6' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#6b7280'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #14b8a6;
    background-color: ${props => props.$isActive ? '#0d9488' : '#f0fdfa'};
    color: ${props => props.$isActive ? 'white' : '#14b8a6'};
  }
`
export const ReviewerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`
export const ReviewerCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(20, 184, 166, 0.2);
  }
`
export const ReviewerRank = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%);
  color: white;
  font-weight: 800;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
`
export const ReviewerAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  display: block;
  border: 4px solid #f0fdfa;
`
export const ReviewerInfo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`
export const ReviewerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`
export const ReviewerRole = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`
export const TrustScoreSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
`
export const TrustScoreLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
`
export const TrustScoreValue = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: ${props => props.$color || '#14b8a6'};
  text-align: center;
  margin-bottom: 0.75rem;
`
export const TrustScoreBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`
export const TrustScoreBarFill = styled.div`
  width: ${props => props.$score}%;
  height: 100%;
  background: ${props => props.$color || '#14b8a6'};
  transition: width 0.5s ease-in-out;
`
export const ReviewerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`
export const StatItem = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`
export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`
export const StatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
`
