import React from "react";


export class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        search : "",
        cities : [
          "Houston",
          "Austin",
          "Dallas"
        ],
        selectedCity: "",
        hourly : [],
        temperatures : []
    };
  } 

 

  handleInputChange = (e) =>{
    //alert(e.target.value);
    this.setState({
      search: e.target.value
  });
    //this.state.search = e.target.value;
 }

 capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
 }

  validateAndAddLocation = () => {
    //const loc = document.getElementById("search").value;
    const loc = this.capitalizeFirstLetter(this.state.search);

    if(this.state.cities.includes(loc)){
      this.setState({
        search: ''
      })
      return;
    }

    const base_url = "https://geocoding-api.open-meteo.com/v1/search?name=" + loc;


    fetch(base_url)
    .then(response=>response.json())
    .then(data=>{ 
      if(data.results){
        this.setState({
          cities: [
            ...this.state.cities,
            loc
          ]
       }); 
       this.selectCity(loc)
      } else{
        alert("Could not find weather for " + loc)
      }
    })

  
  this.setState({
    search: ''
  })
  }

  showTimes = () => {
    let times = []

    for (let i = 0; i < 12; i++){
      let val = "" + this.state.hourly[i]
      let hr = val.substring(10)
      times.push(
        <div className="info">
          {hr}
        </div>
      )
    }
    return times;
  }

  showTemps = () => {
    let temps = []

    for (let i = 0; i < 12; i++){
      let val = Math.round(this.state.temperatures[i]) + " F"
      temps.push(
        <div className="info">
          {val}
        </div>
      )
    }
    return temps;
  }

  displayWeather = () => {
    if(this.state.hourly.length === 0){
      return;
    }

    return (
      <div id="weatherDisplay">
        <div className="row">
          <div className="col1">
            <h3>Time</h3>
            {
              this.showTimes()
            }
          </div>
          <div className="col2">
            <h3>Temperature</h3>
            {
              this.showTemps()
            }
          </div>
        </div>
        {
          //this.showinfo()
        }
      </div>
    )
  }

  populateWeather = (city) => {
    if(city === ""){
      return;
    }

    const base_url = "https://geocoding-api.open-meteo.com/v1/search?name=" + city;
    fetch(base_url)
    .then(response=>response.json())
    .then(data=>{
      let lat = data.results[0].latitude
      let long = data.results[0].longitude
      //alert(lat +","+ long);

      const wea_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&temperature_unit=fahrenheit`
      return fetch(wea_url)
    }).then(response=>response.json())
    .then(data=>{
      this.setState({
        hourly : data.hourly.time
    
      })

      this.setState({
        temperatures : data.hourly.temperature_2m
        
      })
      //alert(JSON.stringify(data.hourly.temperature_2m))
    }
    )
  }
  

  selectCity = (city) => {
    this.setState ({
        selectedCity: city
    })

    this.populateWeather(city)
  }

  renderCities = () => {
    return (
      this.state.cities.map((city,index) => {
        if(city === this.state.selectedCity){
          return <button key={city+""+index} className="btn clicked" type="button" onClick={() => this.selectCity(city)}>{city}</button>
        }else{
          return <button key={city+""+index} className="btn" type="button" onClick={() => this.selectCity(city)}>{city}</button>
        }
        
      })
    )
  };

  render() {
    return (
    <div className="Weather">
      <div className="Location">
        {
          this.renderCities(this.cities)
        }
      </div>
      <div className="Input">
        <input className="search" type="text" value={this.state.search} onChange={this.handleInputChange}/>
        <button className="btn" type="button" onClick={this.validateAndAddLocation}>+</button>
      </div>
      {
        //this.populateWeather()
        this.displayWeather()
      }
    </div>
  );
    }

}