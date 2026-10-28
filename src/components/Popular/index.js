import {Component} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import PopularItem from '../PopularItem'
import MovieContext from '../../context/MovieContext'

import './index.css'

class Popular extends Component {
  render() {
    return (
      <MovieContext.Consumer>
        {value => {
          const {username} = value
          console.log('username from Home', {username})

          return (
            <>
              <div className="home-container" testid="popular">
                <Header />
                <PopularItem />
                <Footer />
              </div>
            </>
          )
        }}
      </MovieContext.Consumer>
    )
  }
}

export default Popular
