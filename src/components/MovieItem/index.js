import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import LoaderElement from '../LoaderElement'

import MovieContext from '../../context/MovieContext'

import './index.css'

const apiConstants = {
  initail: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItem extends Component {
  state = {
    apiStatus: apiConstants.initail,
    movieItemDetails: [],
    similarMovieItems: [],
  }

  componentDidMount() {
    this.getMovieItemDetails()
  }

  getFormattedData = each => ({
    id: each.id,
    adult: each.adult,
    backdropPath: each.backdrop_path,
    budget: each.budget,
    genres: each.genres,
    name: each.name,
    overview: each.overview,
    posterPath: each.poster_path,
    releaseDate: each.release_date,
    runtime: each.runtime,
    similarMovies: each.similar_movies,
    spokenLanguages: each.spoken_languages,
    title: each.title,
    voteAverage: each.vote_average,
    voteCount: each.vote_count,
    rating: each.rating,
  })

  getMovieItemDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.movie_details)

      this.setState({
        apiStatus: apiConstants.success,
        movieItemDetails: updatedData,
        similarMovieItems: updatedData.similarMovies.slice(0, 6),
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  changeNewMovieDetails = () => {
    this.getMovieItemDetails()
  }

  render() {
    return (
      <MovieContext.Consumer>
        {value => {
          const {username} = value
          console.log('username from trending', {username})

          const renderLoader = () => <LoaderElement />

          const renderMovieItem = () => {
            this.getMovieItemDetails()
          }

          const renderSuccessView = () => {
            const {movieItemDetails, similarMovieItems} = this.state
            const {
              id,
              adult,
              backdropPath,
              budget,
              genres,
              name,
              overview,
              posterPath,
              releaseDate,
              runtime,
              similarMovies,
              spokenLanguages,
              title,
              voteAverage,
              voteCount,
              rating,
            } = movieItemDetails
            const backgroundImage = backdropPath
            const hoursString = Math.floor(runtime / 60)
            const minutesString = runtime % 60
            const dateString = new Date(releaseDate)
            let dateEnd
            const day = dateString.getDay().toString()
            if (day.endsWith('3')) {
              dateEnd = 'rd'
            } else if (day.endsWith('3')) {
              dateEnd = 'nd'
            } else if (day.endsWith('3')) {
              dateEnd = 'st'
            } else {
              dateEnd = 'th'
            }
            return (
              <div className="home-background" testid="movieItem">
                <div
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                  }}
                  className="movies-details-top-container"
                >
                  <h1 className="movies-details-top-container-heading">
                    {title}
                  </h1>
                  <div className="hours-container">
                    <p className="hours">{`${hoursString}h ${minutesString}m`}</p>
                    <p className="language">{adult ? 'A' : 'U/A'}</p>
                    <p className="hours">{dateString.getFullYear()}</p>
                  </div>
                  <p className="overview">{overview}</p>
                  <button type="button" className="button">
                    Play
                  </button>
                </div>
                <div className="genre-container">
                  <ul>
                    <h1 className="genre-heading">Genres</h1>
                    {genres.map(each => (
                      <li className="genre-option" key={each.id}>
                        <p>{each.name}</p>
                      </li>
                    ))}
                  </ul>
                  <ul>
                    <h1 className="genre-heading">Audio Available</h1>
                    {spokenLanguages.map(each => (
                      <li className="genre-option" key={each.id}>
                        <p>{each.english_name}</p>
                      </li>
                    ))}
                  </ul>
                  <ul>
                    <h1 className="genre-heading">Rating Count</h1>
                    <li className="genre-option">
                      <p>{voteCount}</p>
                    </li>
                    <h1 className="genre-heading">Rating Average</h1>
                    <li className="genre-option">
                      <p>{voteAverage}</p>
                    </li>
                  </ul>
                  <ul>
                    <h1 className="genre-heading">Budget</h1>
                    <li className="genre-option">
                      <p>{budget} crores</p>
                    </li>
                    <h1 className="genre-heading">Release Date</h1>
                    <li className="genre-option">
                      <p>{`${day} ${dateEnd} ${dateString.toLocaleString(
                        `default`,
                        {
                          month: 'long',
                        },
                      )} ${dateString.getFullYear()}`}</p>
                    </li>
                  </ul>
                </div>
                <h1 className="similar-heading">More like this</h1>
                <ul className="similar-movies-container">
                  {similarMovieItems.map(each => (
                    <li key={each.id} className="link">
                      <Link to={`/movies/${each.id}`} target="blank">
                        <img
                          src={each.poster_path}
                          alt={each.title}
                          className="similar-movie-image"
                          onClick={this.changeNewMovieDetails}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          const renderFailureView = () => (
            <div className="failure-view-container">
              <img
                src="https://res.cloudinary.com/dtjcxf7z5/image/upload/v1650297174/Mini%20Project%20Netflix%20Clone/Background-complete_t8c6z1.png"
                alt="failure view"
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

          const getResult = () => {
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

          return <div testid="movieItem">{getResult()}</div>
        }}
      </MovieContext.Consumer>
    )
  }
}

export default withRouter(MovieItem)
