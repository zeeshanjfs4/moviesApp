import {Component} from 'react'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import Cookies from 'js-cookies'
import LoadingElement from '../LoaderElement'

import MovieContext from '../../context/MovieContext'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchElement extends Component {
  state = {
    apiStatus: apiConstants.initial,
    allSearchResults: [],
    searchInput: '',
  }

  componentDidCatch() {
    this.getSearchElementVideos()
  }

  getSearchElementVideos = async () => {
    const {searchInput} = this.state

    this.setState({apiStatus: apiConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
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
        searchInput: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickInput = event => {
    if (event.key === 'Enter') {
      this.getSearchElementVideos()
    }
  }

  render() {
    const {searchInput} = this.state

    const searchElements = () => {
      this.getSearchElementVideos()
    }

    return (
      <MovieContext.Consumer>
        {value => {
          const {username} = value
          console.log('username from popular', {username})

          const renderLoader = () => <LoadingElement />

          const renderSuccessView = () => {
            const {allSearchResults} = this.state
            const showSearchResults = allSearchResults.length > 0

            return showSearchResults ? (
              <div className="popular-video-list-container">
                <ul className="popular-video-list">
                  {allSearchResults.map(each => (
                    <li key={each.id}>
                      <Link to={`/movies/${each.id}`} key={each.id}>
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
            ) : (
              <div className="failure-view-container">
                <img
                  src="https://res.cloudinary.com/dtjcxf7z5/image/upload/v1650384280/Mini%20Project%20Netflix%20Clone/no_results_tjfdmg.png"
                  alt="no movies"
                  className="failure-image"
                />
                <p>Your search for {inputValue} did not find any matches.</p>
              </div>
            )
          }

          const renderMovies = () => {
            this.getSearchElementVideos()
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

          return (
            <div testid="searchItem" className="search-element">
              <div className="input-element-container">
                <input
                  type="search"
                  value={searchInput}
                  onChange={this.changeSearchInput}
                  placeholder="Search"
                  onKeyDown={this.onClickInput}
                  className="input-element"
                />
                <button
                  type="button"
                  className="search-button"
                  testid="searchButton"
                  onClick={searchElements}
                >
                  <HiOutlineSearch size={25} color="white" />
                </button>
              </div>
              {getResults()}
            </div>
          )
        }}
      </MovieContext.Consumer>
    )
  }
}

export default SearchElement
