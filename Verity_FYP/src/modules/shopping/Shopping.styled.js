import styled from 'styled-components'

export const ShoppingContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
`

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #14b8a6;
  }
`

export const SearchBar = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }
`

export const FilterSection = styled.div`
  margin-bottom: 2rem;
`

export const CategoryTabs = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`

export const CategoryTab = styled.button`
  padding: 0.625rem 1.25rem;
  border: 2px solid ${props => props.$isActive ? '#14b8a6' : '#e5e7eb'};
  background: ${props => props.$isActive ? '#14b8a6' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#6b7280'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #14b8a6;
    background: ${props => props.$isActive ? '#0d9488' : '#f0fdfa'};
  }
`

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`

export const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f3f4f6;
`

export const ProductInfo = styled.div`
  padding: 0.875rem;
`

export const ProductName = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`

export const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #14b8a6;
  margin-bottom: 0.75rem;
`

export const ProductBusiness = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`

export const BusinessAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #14b8a6;
`

export const BusinessName = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
`

export const ProductStats = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #6b7280;

  svg {
    color: #9ca3af;
    width: 14px;
    height: 14px;
  }
`

export const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const LikeButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2;
  }
`

export const BuyButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #10b981;
  background: #10b981;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #059669;
    border-color: #059669;
  }
`

export const MessageButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #14b8a6;
  background: #14b8a6;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #0d9488;
    border-color: #0d9488;
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;

  svg {
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #9ca3af;
  }
`
