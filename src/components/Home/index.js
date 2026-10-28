import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import Trending from '../Trending'
import LoaderElement from '../LoaderElement'
import Originals from '../Originals'
import TopRated from '../TopRated'
import MovieContext from '../../context/MovieContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    allTrendingVideos: [],
  }

  componentDidMount() {
    this.getAllVideos()
  }

  getAllVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.results.map(each => ({
        id: each.id,
        backdropPath: each.backdrop_path,
        overview: each.overview,
        posterPath: each.poster_path,
        title: each.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        allTrendingVideos: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  render() {
    const renderSuccessView = () => {
      const {allTrendingVideos} = this.state

      const homeHeaderItem =
        allTrendingVideos[Math.floor(Math.random() * allTrendingVideos.length)]

      const backgroundImage = homeHeaderItem.backdropPath
      const titleOfHeader = homeHeaderItem.title
      const overviewOfHeader = homeHeaderItem.overview

      return (
        <div
          className="spiderman-container"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Header />
          <div className="home-header-content">
            <h1 className="movie-details-name">{titleOfHeader}</h1>
            <p className="movie-details-description">{overviewOfHeader}</p>
            <button className="movie-details-play-button">Play</button>
          </div>
        </div>
      )
    }

    const renderMovieItem = () => {
      this.getAllVideos()
    }

    const renderLoader = () => <LoaderElement />

    const renderFailureView = () => (
      <div className="failure-view-container">
        <img
          src="https://res.cloudinary.com/dtjcxf7z5/image/upload/v1650297174/Mini%20Project%20Clone/Background-complete_t8c6z1.png"
          alt="failure view"
          className="failure-image"
        />
        <p className="search-content">Something went wrong. Please try again</p>

        <button
          type="button"
          className="try-again-button"
          onClick={renderMovieItem}
        >
          Try again
        </button>
      </div>
    )

    const getResult = () => {
      const {apiStatus} = this.state
      switch (apiStatus) {
        case apiStatusConstants.success:
          return renderSuccessView()
        case apiStatusConstants.failure:
          return renderFailureView()
        case apiStatusConstants.inProgress:
          return renderLoader()
        default:
          return null
      }
    }

    return (
      <MovieContext.Consumer>
        {value => {
          const {username} = value
          console.log('username from Home', {username})

          return (
            <>
              <div className="home-container" testid="home">
                {getResult()}
                <h1 className="trending-heading">Trending Now</h1>
                <Trending />
                <h1 className="trending-heading">Top Rated</h1>
                <TopRated />
                <h1 className="trending-heading">Originals</h1>
                <Originals />
              </div>
              <Footer />
            </>
          )
        }}
      </MovieContext.Consumer>
    )
  }
}

export default Home
