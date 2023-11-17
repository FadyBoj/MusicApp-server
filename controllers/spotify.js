const querystring = require('querystring');
const axios = require('axios');
const CustomAPIError = require('../error/custom-error');
const client_id = "0f678cf0de9d42bc9015ac92b5fa3801";
const client_secret = "a8084315bc03437aac106dddeae3ee8b";
const redirect_uri = "http://localhost:8000/spotify-api/get-token";
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const fs = require('fs');
const path = require('path');
const rootDirectory = path.dirname(require.main.filename)
const getSpotifyCode = async(req,res) =>{
  const scope = 'user-top-read playlist-read-private';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    }));

}

const callBack = async(req,res) =>{
    
    const {code} = req.query;

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token",querystring.stringify({
            code:code,
            redirect_uri:redirect_uri,
            grant_type: 'authorization_code'
        }),{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            }
        })


        console.log(response.data)
        res.status(200).json({access_token:response.data.access_token})

    } catch (error) {
        console.log(error)
    }


}

const refreshToken = async(req,res) =>{
  const refreshToken = "AQA2Xplo75KI5XHAu_jiS08vLKQs9l_hFsj7RC4SOuae_9Iz-5tpkxl7DkIje_GIBtSs-XjhGwNqU8rR6sUFJ4L97dKgw3I-bJsFjVAYO__2U37LkFCzhiFuEPJiS9rZwg0";
  
  const response = await axios.post("https://accounts.spotify.com/api/token",querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
  }),{
    headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    }
  })

  res.status(200).json(response.data)

}


const topSongs = async(req,res) =>{
    const  response = await axios.get('https://megnwene.onrender.com/spotify-api/get-token');
    const token = response.data.access_token;

    try {
        const topSongs = await axios.get("https://api.spotify.com/v1/playlists/37i9dQZEVXbNG2KDcFcKOF/tracks?limit=20",{
        headers:{
            'Authorization':`Bearer ${token}`
        }
        
    })
    
    res.status(200).json({songs:topSongs.data.items});
    
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"Unexpected error !"})
    }

    

}

const getSong = async(req,res)=>{

    const { id } = req.query;
    console.log(id)

    try {
    const  response = await axios.get('https://megnwene.onrender.com/spotify-api/get-token');
    const token = response.data.access_token;


    const song = await axios.get(`https://api.spotify.com/v1/tracks/${id}`,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })

    res.status(200).json(song.data)

    } catch (error) {
    console.log(error)   
    }
    
}

const getTopArtist = async (req,res) =>{
    try {
        const  response = await axios.get('https://megnwene.onrender.com/spotify-api/get-token');
        const token = response.data.access_token;

        const artists = await axios.get('https://api.spotify.com/v1/playlists/4liDm4FUbLZKkN7hmwBB0x/tracks?limit=14',{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })

        const ids = artists.data.items.map((item) =>{
            return item.track.album.artists[0].id
        })

        
        const topArtists = await axios.get(`https://api.spotify.com/v1/artists?ids=${ids}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })


        const artistData = topArtists.data.artists.map((item) =>{
            return {
                name:item.name,
                id:item.id,
                image:item.images[0].url,
            }
        })

        res.status(200).json(artistData)
        
    } catch (error) {
        throw new CustomAPIError("Something went wrong",400)
    }
}

//
//
//
//
//

const realtedIds ='1Xyo4u8uXC1ZmMpatF05PJ,4WreACyfQITcXGx86xxYkG,1QAJqy2dA3ihHBFIHRphZj,7290H8m1Dwt8G7jm1y9CQx,1me05HW5s7TShHra5nN7uE';


const recommendations = async (req,res) =>{
    try {

        const  response = await axios.get('https://megnwene.onrender.com/spotify-api/get-token');
        const token = response.data.access_token;

        const recommendations = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${realtedIds}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })


        const ids = recommendations.data.tracks.map((item) =>{
            return item.artists[0].id
        })

        const topArtists = await axios.get(`https://api.spotify.com/v1/artists?ids=${ids}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })


        const artistData = topArtists.data.artists.map((item) =>{
            return {
                name:item.name,
                id:item.id,
                image:item.images[0].url,
            }
        })

        res.status(200).json(artistData)
        

    } catch (error) {
        console.log(error)
    }
}


const getAudio = async (req,res) =>{

    const { name } = req.query;

    const filters = await ytsr.getFilters(name);
    const filter = filters.get('Type').get('Video');
    const searchResults = await ytsr(filter.url ,{limit:1});

    if(searchResults.items.length === 0)
    {
        return res.status(404).json({msg:"No items found"})
    }

    
   const videoID = searchResults.items[0].id;
   
   try {
    const audioURL = ytdl(videoID,{quality:'highestaudio'});

     
    res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline',
      });
   
      // Stream the audio directly to the response
      audioURL.pipe(res);
   


   } catch (error) {
    console.log(error)
   }


}

module.exports = {
    callBack,
    getSpotifyCode,
    refreshToken,
    topSongs,
    getSong,
    getTopArtist,
    recommendations,
    getAudio
}