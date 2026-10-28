import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Search extends Component {
  state = {
    apiStatus: apiConstants.initial,
    searchList: [],
    inputValue: '',
  }

  getSearchViews = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiConstants.success:
        return this.SearchSuccessView()
      case apiConstants.failure:
        return this.PosterFailureView()
      case apiConstants.inProgress:
        return this.HomePageLoadingView()
      default:
        return null
    }
  }

  SearchSuccessView = () => {
    const {searchList} = this.state
    console.log('success', searchList)

    return (
      <div className="popular-movies-section">
        <ul className="d-flex flex-row col-12 similar-movies-list-items">
          {searchList.map(eachMovie => (
            <li className="col-4 p-1">
              <Link to={`/movies/${eachMovie.id}`}>
                <img
                  src={eachMovie.posterPath}
                  alt={eachMovie.title}
                  className="popular-movie-item col-12"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  PosterFailureView = () => {
    const {inputValue} = this.state

    return (
      <div className="d-flex flex-column col-12 align-items-center justify-content-center failure-view">
        <img
          src="https://res.cloudinary.com/dnjuzbuoz/image/upload/v1655559570/Group_7394_jx0wym.png"
          alt="no movies"
        />
        <p>Your search for {inputValue} did not find any matches.</p>
      </div>
    )
  }

  HomePageLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  callSearchApi = async searchInput => {
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`

    this.setState({
      apiStatus: apiConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData, 'Search movies')
      const {results} = await fetchedData
      if (results.length === 0) {
        this.setState({
          apiStatus: apiConstants.failure,
          inputValue: searchInput,
        })
      } else {
        const CamelCaseTrendingMovies = results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          title: eachMovie.title,
        }))
        console.log(CamelCaseTrendingMovies)
        this.setState({
          apiStatus: apiConstants.success,
          searchList: [...CamelCaseTrendingMovies],
        })
      }
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  SearchFun = inputValue => {
    this.callSearchApi(inputValue)
  }

  render() {
    return (
      <div className="search-route">
        <div className="search-header">
          <Header SearchFun={this.SearchFun} search="true" />
        </div>

        <>
          <h1>Home</h1>
        </>

        <div>{this.getSearchViews()}</div>
      </div>
    )
  }
}

export default Search
