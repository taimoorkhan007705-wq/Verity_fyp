import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, MessageCircle, Eye, Search, Filter } from 'lucide-react'
import {
  ShoppingContainer,
  Header,
  HeaderTitle,
  SearchBar,
  SearchInput,
  FilterSection,
  CategoryTabs,
  CategoryTab,
  ProductsGrid,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice,
  ProductBusiness,
  BusinessAvatar,
  BusinessName,
  ProductStats,
  StatItem,
  ProductActions,
  LikeButton,
  BuyButton,
  MessageButton,
  EmptyState
} from './Shopping.styled'
const categories = [
  'All', 
  'Electronics', 
  'Automotive',
  'Fashion & Clothing',
  'Home & Furniture',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Books & Stationery',
  'Toys & Games',
  'Food & Beverages',
  'Health & Wellness',
  'Jewelry & Accessories',
  'Pet Supplies',
  'Garden & Tools',
  'Baby & Kids',
  'Art & Crafts',
  'Music & Instruments',
  'Real Estate',
  'Services',
  'Other'
]
function Shopping() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)
      console.log('Fetching products with params:', params.toString())
      const response = await fetch(`http://localhost:5000/api/products?${params}`)
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Products data:', data)
      if (data.success) {
        console.log('Products found:', data.products.length)
        setProducts(data.products)
      } else {
        console.error('Failed to fetch products:', data.message)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleProductClick = (productId) => {
    navigate(`/shopping/${productId}`)
  }
  const handleLike = async (e, productId) => {
    e.stopPropagation()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/products/${productId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to like product:', error)
    }
  }
  const handleMessage = async (e, product) => {
    e.stopPropagation()
    const message = prompt(`Send a message to ${product.business?.user_info?.fullName} about "${product.name}":`);
    if (message && message.trim()) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/products/${product._id}/inquiry`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: message.trim() })
        })
        const data = await response.json()
        if (data.success) {
          alert('Message sent successfully! The seller will see your inquiry.')
        } else {
          alert('Failed to send message: ' + data.message)
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        alert('Failed to send message. Please try again.')
      }
    }
  }
  const handleBuy = (e, product) => {
    e.stopPropagation()
    alert(`Purchase feature coming soon!\n\nProduct: ${product.name}\nPrice: $${product.price}\nSeller: ${product.business?.user_info?.fullName}`)
  }
  if (loading) {
    return (
      <ShoppingContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading products...
        </div>
      </ShoppingContainer>
    )
  }
  return (
    <ShoppingContainer>
      <Header>
        <HeaderTitle>
          <ShoppingBag size={28} />
          Shopping
        </HeaderTitle>
        <SearchBar>
          <Search size={20} />
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
      </Header>
      <FilterSection>
        <CategoryTabs>
          {categories.map((category) => (
            <CategoryTab
              key={category}
              $isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryTab>
          ))}
        </CategoryTabs>
      </FilterSection>
      {products.length === 0 ? (
        <EmptyState>
          <ShoppingBag size={64} />
          <h3>No Products Found</h3>
          <p>Check back later for new products</p>
        </EmptyState>
      ) : (
        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product._id} onClick={() => handleProductClick(product._id)}>
              <ProductImage
                src={
                  product.images && product.images.length > 0
                    ? `http://localhost:5000${product.images[0].url}`
                    : 'https://via.placeholder.com/300x300?text=No+Image'
                }
                alt={product.name}
              />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                <ProductBusiness>
                  <BusinessAvatar
                    src={
                      product.business?.profile_info?.avatar
                        ? `http://localhost:5000${product.business.profile_info.avatar}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.business?.user_info?.fullName || 'Business')}&background=14b8a6&color=fff&size=150`
                    }
                    alt={product.business?.user_info?.fullName}
                  />
                  <BusinessName>{product.business?.user_info?.fullName}</BusinessName>
                </ProductBusiness>
                <ProductStats>
                  <StatItem>
                    <Eye size={16} />
                    {product.views}
                  </StatItem>
                  <StatItem>
                    <Heart size={16} />
                    {product.likesCount}
                  </StatItem>
                  <StatItem>
                    <MessageCircle size={16} />
                    {product.inquiriesCount}
                  </StatItem>
                </ProductStats>
                <ProductActions>
                  <LikeButton onClick={(e) => handleLike(e, product._id)}>
                    <Heart size={18} />
                    Like
                  </LikeButton>
                  <BuyButton onClick={(e) => handleBuy(e, product)}>
                    <ShoppingBag size={18} />
                    Buy
                  </BuyButton>
                  <MessageButton onClick={(e) => handleMessage(e, product)}>
                    <MessageCircle size={18} />
                    Message
                  </MessageButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </ShoppingContainer>
  )
}
export default Shopping
