import TopMovies from "../categories/NowPlaying";
import NowPlaying from "../categories/NowPlaying";
import TopRatedMovies from "../categories/TopRatedMovies";
import Poster from "./Poster"


const Home=()=>{
    return(
        <>
        <Poster/>
        <NowPlaying/>
        <TopRatedMovies/>
        </>
    )
}
export default Home;