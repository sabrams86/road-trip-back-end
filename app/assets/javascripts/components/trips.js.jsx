// **Info For Dates**
// var months = {
//   '01': "January",
//   '02': "February",
//   '03': "March",
//   '04': "April",
//   '05': "May",
//   '06': "June",
//   '07': "July",
//   '08': "August",
//   '09': "September",
//   '10': "October",
//   '11': "November",
//   '12': "December"
// }

var eventIcons = {
  'restaurant': 'fa fa-cutlery',
  'lodging': 'fa fa-bed',
  'museum': 'fa fa-institution',
  'gas_station': 'fa fa-car',
}

var TripDashboard = React.createClass({
  getInitialState: function(){
    return {
      status: 1,
      trip: "",
      destinations: [],
      finished: false,
      lat: 0,
      long: 0
    }
  },
  componentDidMount: function(){
    console.log("here again");
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + window.location.pathname.split('/')[4] + '.json', function(results){


      if(this.isMounted()){
        // var start_atts = results.start_date.split("-")
        var events = results.events
        // var start_date = months[start_atts[1]] + " " + start_atts[2] + ", " + start_atts[0];
        // var end_atts = results.end_date.split("-")
        // var end_date = months[end_atts[1]] + " " + end_atts[2] + ", " + end_atts[0];
        var destinations = results.destinations.map(function (e) {
          console.log(e);
          var destEvents = []
          events.forEach(function (event) {
            if (event.destination_id === e.id){
              destEvents.push(event);
            }
          })
          return {name: e.name, destinationid: e.id, events: destEvents, lat: e.lat, lng: e.lng, place_id: e.place_id};
        });
        this.setState({
          trip: results,
          // start_date: start_date,
          // end_date: end_date,
          destinations: destinations,
          finished: results.finished
        })
      }
    }.bind(this))
  },
  getTripInfo: function(){
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + window.location.pathname.split('/')[4] + '.json', function(results){
      if(this.isMounted()){
        // var start_atts = results.start_date.split("-")
        var events = results.events
        // var start_date = months[start_atts[1]] + " " + start_atts[2] + ", " + start_atts[0];
        // var end_atts = results.end_date.split("-")
        // var end_date = months[end_atts[1]] + " " + end_atts[2] + ", " + end_atts[0];
        var destinations = results.destinations.map(function (e) {
          var destEvents = []
          events.forEach(function (event) {
            if (event.destination_id === e.id){
              destEvents.push(event);
            }
          })
          return {name: e.name, destinationid: e.id, events: destEvents, lat: e.lat, lng: e.lng, place_id: e.place_id};
        });
        this.setState({
          trip: results,
          // start_date: start_date,
          // end_date: end_date,
          destinations: destinations,
          finished: results.finished
        })
      }
    }.bind(this))
  },
  itinerary: function(){
    console.log(this.state.status);
    this.setState({
      status: 1
    })
  },
  blogs: function(){
        console.log(this.state.status);

    this.setState({
      status: 2
    })
  },
  activities: function(){
        console.log(this.state.status);

    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      }
    }.bind(this))
    this.setState({
      status: 3
    })
  },
  render: function(){

    return(
      <div>
        <h1>lkajsdlfkjadsf</h1>
        <ul className="tabs" data-tab>
          <li className="tab-title small-4 active"><a href="#panel1" onClick={this.itinerary}>Itinerary</a></li>
          <li className="tab-title small-4"><a href="#panel2" onClick={this.blogs}>Blog</a></li>
          <li className="tab-title small-4"><a href="#panel3" onClick={this.activities}>Activities</a></li>
        </ul>
        <div>
          {this.state.status === 1 ? <Itinerary finished={this.state.finished} updateTrip={this.getTripInfo} trip={this.state.trip} destinations={this.state.destinations}/> : <Activities finished={this.state.finished} updateTrip={this.getTripInfo} trip={this.state.trip} destinations={this.state.destinations}/>}
         </div>
      </div>
    )
  }

})

var NewBlogPost = React.createClass({
  getInitialState: function(){
    return {lat: 0, long: 0}
  },
  componentWillMount: function(){
    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      }
    }.bind(this))
  },
  render: function () {
    return (
      <form action={'/users/'+window.location.pathname.split('/')[2]+'/trips/'+window.location.pathname.split('/')[4]+'/posts'} method='post'>
      <input type="hidden" name='post[latitude]' value={this.state.lat}/>
      <input type="hidden" name='post[longitude]' value={this.state.long}/>
      <input type="text" name='post[title]' placeholder="Title"/>
      <textarea cols="20" name='post[content]' rows="10" placeholder="What did you do today?"></textarea>
      <input type='submit' value='blog!' className='button'/>
      </form>
    )
  }
})


var EditPost = React.createClass({
  render: function () {
    var postTitle = $('editTitle').val()
    var postContent = $('editContent').val()
    console.log('this blogs id is', this.props.id)
    return(
    <form action={'/users/'+window.location.pathname.split('/')[2]+'/trips/'+window.location.pathname.split('/')[4]+'/posts/'+ this.props.id} method='post'>
      <input type="text" id='editTitle'  name='post[title]' placeholder={this.props.title}/>
      <textarea cols="20" id='editContent' name='post[content]' rows="10" placeholder="What did you do today?">{this.props.content}</textarea>
      <input type='submit' value='Update' className='button'/>
    </form>
    )
  }
})



var newPostButton = React.createClass({
  getInitialState: function() {
    return { showResults: false };
  },
  onClick: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  render: function() {
    return (
      <div>
      <button  onClick={this.onClick} ><span className='fi-pencil'></span> Add new blog post</button>
      { this.state.showResults ? <NewBlogPost /> : null }
      </div>
    );
  }
});

var NewDestinationButton = React.createClass({
  getInitialState: function() {
    return { showResults: false };
  },
  onClick: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  render: function() {
    return (
      <div>
      <button  onClick={this.onClick} ><span className='fi-pencil'></span> Add a new trip destination</button>
      { this.state.showResults ? <NewDestinationForm /> : null }
      </div>
    );
  }
});

var NewDestinationForm = React.createClass({
  render: function () {
    return (
      <form action={'/users/'+window.location.pathname.split('/')[2]+'/trips/'+window.location.pathname.split('/')[4]+'/destinations'} method='post'>
        <input type='hidden' name='_method' value='post'/>
        <input type="text" name='destination[name]' placeholder="City, State"/>
        <input type='submit' value='Add Stop' className='button'/>
      </form>
    )
  }
})

var BlogCarousel = React.createClass({
  getInitialState: function () {
    return {posts: ''}
  },
  componentDidMount: function(){
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + window.location.pathname.split('/')[4] + '/posts', function(results){
      if(this.isMounted()){
        this.setState({
          posts: results
        })
      }
    }.bind(this))
  },
  render: function () {
    var allPosts = this.state.posts
    var displayPosts = [];
    for(var i = 0; i < allPosts.length; i++){
      displayPosts.push(< PostComponent key={allPosts[i].id} data={allPosts[i]} />)
    }
    return (
      <div className="display-posts">
        {displayPosts}
      </div>
    )
  }
})

var PostComponent = React.createClass({
  getInitialState: function(){
    return {lat: 0, long: 0, editForm: false}
  },
  componentWillMount: function(){
    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        })
      }
    }.bind(this))
  },

  toggleForm: function () {
    this.state.editForm === true ? this.setState({ editForm: false }) : this.setState({ editForm: true })
  },

  render: function () {
    var data = this.props.data
    var date = data.created_at.split('T')
    var endDate = date[0].split('-')
    var displayDate = (endDate[1].toString() + " " +  endDate[2].toString()+ " " + endDate[0].toString())
    return (
      <div className="post-container">
        <div>
            <button className='button tiny' onClick={this.toggleForm}>EDIT</button>
          {
            this.state.editForm ? <EditPost className='editPost' key={data.id} id={data.id} title={data.title} content={data.content}/>:""
          }
        </div>
        <h1>{data.title}</h1>
        <p>{data.content}</p>
        <p>{displayDate}</p>
      </div>
    )
  }
})



var Itinerary = React.createClass({

  render: function () {
    var trip = this.props.trip
    // This date was showing below h3 Ended In
    // <h3>{this.state.start_date} to {this.state.end_date}</h3>
    var finished = function () {
      this.state.finished ? this.setState({ finished: false }) : this.setState({ finished: true });
      $.post('/users/'+ window.location.pathname.split('/')[2]+ '/trips/' + window.location.pathname.split('/')[4] + '/finished')
    }.bind(this);
    return (
      <div className="itinerary">
        <h1>{trip.name}</h1>
        <h3>Started in {trip.start_location}</h3>
        {this.props.destinations.map(function (e) {
          console.log(e, "this is the itinerary destinations, does it have an id?");
          return (<ItineraryListing getTripInfo={this.props.updateTrip} name={e.name} events={e.events} destinationid={e.destinationid} placeid={e.place_id} lat={e.lat} lng={e.lng}/>)
        }, this)}
        <h3>Ended in {trip.end_location}</h3>
        <button onClick={finished}> {!this.props.finished ? "Mark as Finished" : "Finished!"}</button>
      </div>
    )
  }
})


var Activities = React.createClass({
  setLocationHere: function () {
    $('#loclat').html(this.props.lat)
    $('#loclong').html(this.props.long)
  },
  render: function () {
    var trip = this.props.trip
    console.log(this.props.destinations, "here is destinations");
    return (
      <div>
        <div className='hideMe'>
          <div id='loclat' className='hidden'>{this.props.lat}</div>
          <div id='loclong' className='hidden'>{this.props.long}</div>
          <div id='destinationid' className='hidden'></div>
          <div id='category' className='hidden'></div>
        </div>
        <div className='large-4 columns'>
          <label for="range">Distance (Miles)</label>
          <select className="small" id="range" name="range">
            <option value="1600">1</option>
            <option value="8047">5</option>
            <option value="16093">10</option>
            <option value="32187">20</option>
          </select>
          <button className="small" onClick={this.setLocationHere} >Here & Now</button>
          {this.props.destinations.map(function (e) {
            console.log(e, "this is the destinations");
            return (<Destination getTripInfo={this.props.updateTrip} name={e.name} events={e.events} destinationid={e.destinationid} placeid={e.place_id} lat={e.lat} lng={e.lng}/>)
          }, this)}
        </div>
        <div className='large-8 columns'>
          <PlacesForm getTripInfo={this.props.updateTrip}/>
        </div>
      </div>
    )
  }
})

var Destination = React.createClass({
  getInitialState: function () {
    return {
      togglePlacesForm: false,
      info: ''
    }
  },
  onClick: function() {
    $('#loclat').html(this.props.lat)
    $('#loclong').html(this.props.lng)
    $('#destinationid').html(this.props.destinationid)
    this.state.togglePlacesForm === true ? this.setState({ togglePlacesForm: false }) : this.setState({ togglePlacesForm: true })
  },
  render: function () {
    return (
      <div>
        <h3 className='destination' onClick={this.onClick}>{this.props.name}</h3>
      </div>
    )
  }
})


var ItineraryListing = React.createClass({
  getInitialState: function () {
    return {
      togglePlacesForm: false,
      info: ''
    }
  },
  onClick: function() {
    $('#loclat').html(this.props.lat)
    $('#loclong').html(this.props.lng)
    $('#destinationid').html(this.props.destinationid)
    this.state.togglePlacesForm === true ? this.setState({ togglePlacesForm: false }) : this.setState({ togglePlacesForm: true })
  },
  deleteEvent: function (id) {
    $.post("/users/"+window.location.pathname.split('/')[2]+"/trips/" + window.location.pathname.split('/')[4] + "/destinations/"+this.props.destinationid  +"/events/"+id, function(results){
    });
    this.props.getTripInfo();
  },
  render: function () {
    var eventList = this.props.events.map(function (e) {
      return (<div className="eventlisting">
                <div className="large-7 columns">
                  <i className={eventIcons[e.category]}></i>&nbsp;&nbsp;
                  {e.name}&nbsp;&nbsp;
                </div>
                <div className="large-3 columns">
                  <MoreInfoModalButton className="inline" placeid={e.place_id}/>
                </div>
                <div className="large-2 columns">
                  <i onClick={this.deleteEvent.bind(this, e.id)} className="fa fa-close right"></i>&nbsp;
                </div>
              </div>)
    }, this)
    return (
      <div className='row clear'>
        <h3 className='itinerarylisting' onClick={this.onClick}>{this.props.name}</h3>
        {eventList}
      </div>
    )
  }
})

var PlacesForm = React.createClass({
  getInitialState: function() {
    return {
      searchResults: []
    }
  },
  onClick: function (lat, lng, category, range) {
    var lat = $('#loclat').html();
    var lng = $('#loclong').html();
    var range = $('#range').val();
    $('#category').html(category)
    $.get('/find_places?lat='+lat+'&lng='+lng+'&range='+range+'&category='+category, function(results){
      if(this.isMounted()){
        this.setState({
          searchResults: results
        })
      }
    }.bind(this))
  },
  render: function () {
    return (
      <div>
        <div className="icon-bar three-up">
          <a className="item" onClick={this.onClick.bind(this, this.props.lat, this.props.lng, "restaurant", "500")}>
            <label>Food</label>
          </a>
          <a className="item" onClick={this.onClick.bind(this, this.props.lat, this.props.lng, "lodging", "500")}>
            <label>Hotels</label>
          </a>
          <a className="item" onClick={this.onClick.bind(this, this.props.lat, this.props.lng, "museum", "500")}>
            <label>Activities</label>
          </a>
        </div>
        <PlacesResults getTripInfo={this.props.getTripInfo} results={this.state.searchResults}/>
      </div>
    )
  }
})

var PlacesResults = React.createClass({
  getInitialState: function () {
    return ({
      info: ''
    })
  },
  getInfo: function (placeId) {
    $.get("/show_info?place_id="+placeId, function(results){
      if(this.isMounted()){
        this.setState({
          info: results
        })
      }
    }.bind(this))
  },
  saveEvent: function (placeId, name) {
    var destinationId = $('#destinationid').html();
    var category = $('#category').html();
    console.log(destinationId);
    $.post("/users/"+window.location.pathname.split('/')[2]+"/trips/" + window.location.pathname.split('/')[4] + "/destinations/"+destinationId+"/events?event[place_id]="+placeId+"&event[name]="+name+"&event[category]="+category, function(results){
      console.log(results);
    })
    this.props.getTripInfo();

  },
  render: function () {
    if (this.props.results.data){
      var listings = this.props.results.data.results.map(function (result) {
        return (<div className="placesresult clear">
                  <div className="large-7 columns">
                    <button type='submit' onClick={this.saveEvent.bind(this, result.place_id, result.name)} className="button tiny success">Save</button>
                    <MoreInfoModalButton className="inline" placeid={result.place_id}/>
                  </div>
                  <div className="large-5 columns">
                    <h5 className="inline">{result.name}</h5>
                  </div>
                </div>);
      }, this);
    }
    return (
      <div className="searchresultlistings">
        {listings}
      </div>
    )
  }
})

var MoreInfoModalButton = React.createClass({
  getInitialState: function () {
    return ({
      info: ''
    })
  },
  getInfo: function (placeId) {
    $.get("/show_info?place_id="+placeId, function(results){
      if(this.isMounted()){
        this.setState({
          info: results
        })
      }
    }.bind(this))
  },
	handleClick: function(){
    $.get("/show_info?place_id="+this.props.placeid, function(results){
      if(this.isMounted()){
        console.log(results);
        this.setState({
          info: results
        })
    		var anchor = $('<a class="close-reveal-modal">&#215;</a>');
        var eventInfo = $("<div><h2>Name:</h2><p>"+results.data.result.name+"</p><h3>Address:</h3><p>"+results.data.result.formatted_address+"</p><h3>Phone:</h3><p>"+results.data.result.formatted_phone_number+"</p><h3>Website:</h3><p><a href='"+results.data.result.website+"' target='_blank'>Click Here</a></p></div>");
        $('#infocontent').html(null);
        $('#infocontent').append(eventInfo);
    		var reveal = $('<div class="reveal-modal" data-reveal>').append($('#modal').html()).append($(anchor));
    		$(reveal).foundation().foundation('reveal', 'open');
    		$(reveal).bind('closed.fndtn.reveal', function(e){
          React.unmountComponentAtNode(this);
        });

    		if(React.isValidElement(this.props.revealContent)) {
    			React.render(this.props.revealContent, $('#modal')[0]);
    		}
    		else {
    			$('#infocontent').append(this.props.revealContent);
    		}
      }
    }.bind(this))

	},
	render: function(){
		return (
			<div className="inline">
        <button onClick={this.handleClick} className="button tiny info">More Info</button>
			</div>
		);
	}
});
