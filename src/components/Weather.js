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

  displayWeather = () => {
    return (
      <div id="weatherDisplay">

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
      alert(lat +","+ long);

      const wea_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&temperature_unit=fahrenheit`
      return fetch(wea_url)
    }).then(response=>response.json())
    .then(data=>{
      alert(JSON.stringify(data))
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
      }
    </div>
  );
    }

}