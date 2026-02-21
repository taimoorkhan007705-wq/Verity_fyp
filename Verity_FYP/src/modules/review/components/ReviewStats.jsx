import { StatsGrid, StatCard, StatLabel, StatValue } from '../ReviewCenter.styled'

function ReviewStats({ stats }) {
  return (
    <StatsGrid>
      <StatCard>
        <StatLabel>Pending Reviews</StatLabel>
        <StatValue $color="#f59e0b">{stats.pending}</StatValue>
      </StatCard>
      <StatCard>
        <StatLabel>Approved Today</StatLabel>
        <StatValue $color="#10b981">{stats.approved}</StatValue>
      </StatCard>
      <StatCard>
        <StatLabel>Rejected Today</StatLabel>
        <StatValue $color="#ef4444">{stats.rejected}</StatValue>
      </StatCard>
      <StatCard>
        <StatLabel>Verity Score</StatLabel>
        <StatValue $color="#14b8a6">{stats.accuracy}%</StatValue>
      </StatCard>
    </StatsGrid>
  )
}

export default ReviewStats
