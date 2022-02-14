// import libraries
import {useEffect, useState} from 'react';
import axios from 'axios';

// function to search spotify songs
function App() {
  // define variables
  const CLIENT_ID = "69a5105136bd4a85891e8856d6b928ca"
  const CLIENT_SECRET = '855c3482b16244b6a34368d98e1219b2'
  const REDIRECT_URI = "http://localhost:3000/callback"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  // set States
  const [token, setToken] = useState("") // token
  const [searchKey, setSearchKey] = useState("") // query
  const [artists, setArtists] = useState([]) // artists
  // const [songs, setSongs] = useState([]) // songs

  // log out component
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  // if (!error && response.statusCode === 200) {

  //   // use the access token to access the Spotify Web API
  //   var token = body.access_token;
  //   var options = {
  //     url: 'https://api.spotify.com/v1/users/jmperezperez',
  //     headers: {
  //       'Authorization': 'Bearer ' + token
  //     },
  //     json: true
  //   };
  //   request.get(options, function(error, response, body) {
  //     console.log(body);
  //   });
  // }

  // search artists component
  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist"
        }
    })

    setArtists(data.artists.items)
  }

  // artists' data component
  const renderArtists = () => {
    return artists.map(artist => (
        <div key={artist.id}>
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            {artist.name}
        </div>
    ))
}
  
  // get the authorization hash
  // from: https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])
  

  return (
    <div className="App">
      <h1>Spotify React</h1>
      {/* if there's a token, log in*/}
      {/* if you're already logged in, show the logout button */}
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          : <button onClick={logout}>Logout</button>}
        
      <h1>Search Artists</h1>
      <form onSubmit={searchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
        <button type={"submit"}>Search</button>
      </form>
      {renderArtists()}
    </div>
  );
}

export default App;