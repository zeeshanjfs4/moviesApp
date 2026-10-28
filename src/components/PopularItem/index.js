import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import LoaderElement from '../LoaderElement'

import MovieContext from '../../context/MovieContext'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PopularItem extends Component {
  state = {
    apiStatus: apiConstants.initial,
    allPopularVideos: [],
  }

  componentDidMount() {
    this.getPopularItemVideos()
  }

  getPopularItemVideos = async () => {
    this.setState({apiStatus: apiConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
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
        apiStatus: apiConstants.success,
        allPopularVideos: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  render() {
    return (
      <MovieContext.Consumer>
        {value => {
          const {username} = value
          console.log('username from popular', {username})

          const renderLoader = () => <LoaderElement />

          const renderSuccessView = () => {
            const {allPopularVideos} = this.state

            return (
              <div className="popular-video-list-container">
                <ul className="popular-video-list">
                  {allPopularVideos.map(each => (
                    <li key={each.id}>
                      <Link to={`/movies/${each.id}`}>
                        <img
                          src={each.posterPath}
                          alt={each.title}
                          className="popular-image"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          const renderMovieItem = () => {
            this.getPopularItemVideos()
          }

          const renderFailureView = () => (
            <div className="failure-view-container">
              <img
                src="https://res.cloudinary.com/dtjcxf7z5/image/upload/v1650297174/Mini%20Project%20Netflix%20Clone/Background-complete_t8c6z1.png"
                alt="failure view"
                className="failure-image"
              />
              <p className="search-content">
                Something went wrong. Please try again
              </p>
              <button
                type="button"
                className="try-again-button"
                onClick={renderMovieItem}
              >
                Try again
              </button>
            </div>
          )

          const getResults = () => {
            const {apiStatus} = this.state

            switch (apiStatus) {
              case apiConstants.success:
                return renderSuccessView()
              case apiConstants.failure:
                return renderFailureView()
              case apiConstants.inProgress:
                return renderLoader()
              default:
                return null
            }
          }

          return <div testid="trending">{getResults()}</div>
        }}
      </MovieContext.Consumer>
    )
  }
}

export default PopularItem
