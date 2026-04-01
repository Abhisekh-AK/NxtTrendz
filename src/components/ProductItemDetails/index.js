// Write your code here
import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {productInfo: {}, similarProducts: [], count: 1, apiStatus: 'INITIAL'}

  componentDidMount() {
    this.getIndividualProductsData()
  }

  onIncrementCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onDecrementCount = () => {
    this.setState(prevState => ({
      count: prevState.count > 1 ? prevState.count - 1 : 1,
    }))
  }

  renderProductsPage = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getIndividualProductsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.id,
        title: fetchedData.title,
        brand: fetchedData.brand,
        description: fetchedData.description,
        availability: fetchedData.availability,
        price: fetchedData.price,
        rating: fetchedData.rating,
        totalReviews: fetchedData.total_reviews,
        imageUrl: fetchedData.image_url,
      }
      const updatedSimilarItems = fetchedData.similar_products.map(
        eachItem => ({
          id: eachItem.id,
          title: eachItem.title,
          brand: eachItem.brand,
          rating: eachItem.rating,
          price: eachItem.price,
          availability: eachItem.availability,
          totalReviews: eachItem.total_reviews,
          description: eachItem.description,
          imageUrl: eachItem.image_url,
        }),
      )
      this.setState({
        productInfo: updatedData,
        similarProducts: updatedSimilarItems,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="products-error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="products-failure-img"
        />
        <h1 className="product-failure-heading-text">Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-btn"
          onClick={this.renderProductsPage}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  renderProductItemDetailsSuccessView = () => {
    const {productInfo, similarProducts, count} = this.state
    const {
      title,
      description,
      imageUrl,
      brand,
      totalReviews,
      rating,
      availability,
      price,
    } = productInfo
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          <div className="product-image-container">
            <img
              src={imageUrl}
              alt="product"
              className="specific-product-img"
            />
          </div>
          <div className="product-text-details-container">
            <h1 className="specific-product-title">{title}</h1>
            <p className="price">{`Rs ${price}/-`}</p>
            <div className="rating-reviews-section">
              <div className="rating-card">
                <p className="specific-product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>

              <p className="specific-product-review">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="specific-product-description">{description}</p>
            <p>{`Available: ${availability}`}</p>
            <p>{`Brand: ${brand}`}</p>
            <hr />
            <div className="plus-minus-container">
              <button
                data-testid="plus"
                type="button"
                className="plus-minus-btn"
                onClick={this.onIncrementCount}
              >
                <BsDashSquare />
              </button>
              <p className="items-count">{count}</p>
              <button
                data-testid="minus"
                type="button"
                className="plus-minus-btn"
                onClick={this.onDecrementCount}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1 className="similar-items-title">Similar Products</h1>
          <ul className="similar-items-container">
            {similarProducts.map(similarItem => (
              <SimilarProductItem
                key={similarItem.id}
                similarItemDetails={similarItem}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderAllProductItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderAllProductItemDetails()}</div>
  }
}

export default ProductItemDetails
