import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecon from './components/FaceRecon/FaceRecon';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/SignIn/Signin';
import Register from './components/Register/Register';
const particalOptions = { 
    particles: {
      number:{
        value:100,
        density:{
          enable:true,
          value_area:800,
        
        }
      },
      color:{value:'#000000'},
      size:{value:3},
      line_linked: {
        enable: true,
        color: '#241f1f',
        opacity: 0.4,
      },
    }
  }

  const app = new Clarifai.App({
    apiKey: 'ae485bdb43a443acac3a699a8364bf9b'
   });
class App extends Component {
  
    constructor(){
    super();
    this.state= {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      IsSignedIn:false,
      user: {
            id:'',
            name:'',
            email:'',
            entries: 0,
            joined:''
      }
    }  
  }
  
loadUser = (data) =>{
  this.setState({user: {
            id:data.id,
            name:data.name,
            email:data.email,
            entries: data.entries,
            joined:data.joined
  }})
} 

calculateFaceLocation = (data) => {
  const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const height = Number(image.height);
  const width = Number(image.width);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}
displayFaceBox = (box) =>{
  this.setState({box: box})
}

  onInputChange = (event) =>{
  this.setState({input:event.target.value});
  }

  onButtonSubmit = () =>{
  this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {
      
      if (response){
        fetch('http://localhost:3000/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
        
      })
      
      })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })

     }
      this.displayFaceBox (this.calculateFaceLocation(response))
    })
        .catch(err => console.log(err)) 
    }
  
onRouteChange = (route) =>{ 
  if (route === 'sign out'){
    this.setState({IsSignedIn:false})
  } else if 
    (route === 'home'){
      this.setState({IsSignedIn:true})
    }
  
  this.setState({route:route});
}

render(){
  const { IsSignedIn, imageUrl, route, box}=this.state
  return (  
    <div className="App">
    <Particles params={particalOptions} className='particles'/>
      <Navigation isSignedIn={IsSignedIn} onRouteChange={this.onRouteChange}/>
      {route === 'home' 
      ?<div>
      <Logo />  
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit ={this.onButtonSubmit}/>
      <FaceRecon box={box} imageUrl={imageUrl} />
    </div>
     :(
        route === 'signin'
       ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
       : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

     )
     
     
      
      }  
    </div>
  ); 
}
}

export default App
