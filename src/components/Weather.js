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
        selectedCity: "Austin",
        hourly : [],
        temperatures : [], 
        currentHour : new Date().getHours()
    };
  } 

  componentDidMount() {
    this.populateWeather("Austin")
  }

  handleInputChange = (e) =>{
    //alert(e.target.value);
    this.setState({
      search: e.target.value
  });
    //this.state.search = e.target.value;
 }

  //capitalize first letter of city input 
  capitalizeFirstLetter = (string) => {
   return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  }

  //check if input is valid location- if invalid throw alert, else add as button
  validateAndAddLocation = () => {
    //const loc = document.getElementById("search").value;
    const loc = this.capitalizeFirstLetter(this.state.search);

    //do nothing if city is already a button
    if(this.state.cities.includes(loc)){
      this.setState({
        search: ''
      })
      return;
    }

    //get locaation details from api
    const base_url = "https://geocoding-api.open-meteo.com/v1/search?name=" + loc;

    fetch(base_url)
    .then(response=>response.json())
    .then(data=>{ 
      //if data exists for input, then it is a valid city
      if(data.results){
        this.setState({
          cities: [
            ...this.state.cities,
            loc
          ]
       }); 
       this.selectCity(loc)
      } else{
        //else fail
        alert("Could not find weather for " + loc)
      }
    })

    //clear input bar when done
    this.setState({
      search: ''
    })
  }

  //display the next 12 hours from current hour
  showTimes = () => {
    let times = []
    let current = this.state.currentHour
    let stop = current + 12

    for (let i = current; i < stop; i++){
      let val = "" + this.state.hourly[i]
      let hr = parseInt(val.substring(11,13))

      //convert to standard time
      let time = (hr % 12) + ":00"

      if(hr === 0 || hr === 12){
        time = "12:00"
      }

      if(hr < 12){
        time = time + " AM"
      } else{
        time = time + " PM"
      }

      times.push(
        <div className="info" key={time}>
          {time}
        </div>
      )
    }
    return times;
  }

  //display temperatures for next 12 hrs based on current time
  showTemps = () => {
    let temps = []
    let current = this.state.currentHour
    let stop = current + 12

    for (let i = current; i < stop; i++){
      let val = Math.round(this.state.temperatures[i]) + " F"
      temps.push(
        <div className="info" key={"temp"+i}>
          {val}
        </div>
      )
    }
    return temps;
  }

  //create the display for time and temperature
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
      </div>
    )
  }

  //get the weather information based on coordinates taken from city name
  populateWeather = (city) => {
    if(city === ""){
      return;
    }

    //get latitude and longitude from city name
    const base_url = "https://geocoding-api.open-meteo.com/v1/search?name=" + city;
    fetch(base_url)
    .then(response=>response.json())
    .then(data=>{
      let lat = data.results[0].latitude
      let long = data.results[0].longitude
      //alert(lat +","+ long);

      //retrieve weather based on lat long values
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
  
  //get city clicked and retrieve results
  selectCity = (city) => {
    this.setState ({
        selectedCity: city
    })

    this.populateWeather(city)
  }

  //update status of buttons
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