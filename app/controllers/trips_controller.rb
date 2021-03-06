class TripsController < ApplicationController
  protect_from_forgery :except => [:update, :delete, :create]
  require 'net/http'
  require 'json'

  def index
    @trips = Trip.where(user_id: params[:user_id])
    respond_to do |format|
      format.html
      format.json {render json: @trips}
    end
  end

  def new
    @trip = Trip.new
  end

  def find_places
    url = URI.parse("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{params[:lat]},#{params[:lng]}&radius=#{params[:range]}&types=#{params[:category]}&key=#{ENV['GOOGLEAPI']}")
    req = Net::HTTP::Get.new(url.request_uri)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response1 = http.request(req)
    res1 = JSON.parse(response1.body)
    render :json => {:data => res1}
  end

  def show_info
    url = URI.parse("https://maps.googleapis.com/maps/api/place/details/json?placeid=#{params[:place_id]}&key=#{ENV['GOOGLEAPI']}")
    req = Net::HTTP::Get.new(url.request_uri)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response1 = http.request(req)
    res1 = JSON.parse(response1.body)
    render :json => {:data => res1}
  end

  def gas_info
    url = URI.parse("https://maps.googleapis.com/maps/api/place/radarsearch/json?location=#{params[:lat]},#{params[:lng]}&radius=100000&types=gas_station&key=#{ENV['GOOGLEAPI']}")
    req = Net::HTTP::Get.new(url.request_uri)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response1 = http.request(req)
    res1 = JSON.parse(response1.body)
    distanceHash = {}
    distanceArr = res1['results'].map do |e|
      dist = ((params[:lat].to_f - e['geometry']['location']['lat'].to_f)**2 + (params[:lng].to_f - e['geometry']['location']['lng'].to_f)**2)**0.5
      distanceHash[dist] = e['place_id']
      dist
    end
    distanceArr = distanceArr.sort
    gas_place_id = distanceHash[distanceArr[0]]


    url = URI.parse("https://maps.googleapis.com/maps/api/directions/json?origin=#{params[:lat]},#{params[:lng]}&destination=place_id:#{gas_place_id}&key=#{ENV['GOOGLEAPI']}")
    req = Net::HTTP::Get.new(url.request_uri)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response2 = http.request(req)
    res2 = JSON.parse(response2.body)
    distance = res2['routes'][0]['legs'][0]['distance']['text']
    render :json => {:data => distance}
  end

  def finished
    @trip = Trip.find(params[:id])
    @user = User.find(current_user.id)
    if @trip.finished.nil?
      @user.total_miles = @user.total_miles + params[:dist].to_i
    end
    @trip.finished = !@trip.finished
    @trip.save
    @user.save
  end

  def create
    start_location_city = params[:trip][:start_location_city]
    start_location_state = params[:trip][:start_location_state]

    end_location_city = params[:trip][:end_location_city]
    end_location_state = params[:trip][:end_location_state]


    url = URI.parse('https://maps.googleapis.com/maps/api/geocode/json?address='+start_location_city+',+'+start_location_state+'&key='+ENV['GOOGLEAPI'])
    req = Net::HTTP::Get.new(url.request_uri)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response1 = http.request(req)
    res1 = JSON.parse(response1.body)

    url = URI.parse('https://maps.googleapis.com/maps/api/geocode/json?address='+end_location_city+',+'+end_location_state+'&key='+ENV['GOOGLEAPI'])
    req = Net::HTTP::Get.new(url.request_uri)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response2 = http.request(req)
    res2 = JSON.parse(response2.body)

    @trip = Trip.new(trip_params)
    @trip.user_id = current_user.id
    @trip.start_location = start_location_city + ", " + start_location_state
    @trip.end_location = end_location_city + ", " +  end_location_state
    @trip.start_location_lat = res1["results"][0]["geometry"]["location"]["lat"]
    @trip.start_location_lng = res1["results"][0]["geometry"]["location"]["lng"]
    @trip.end_location_lat = res2["results"][0]["geometry"]["location"]["lat"]
    @trip.end_location_lng = res2["results"][0]["geometry"]["location"]["lng"]
    @trip.start_place_id = res1["results"][0]["place_id"]
    @trip.end_place_id = res2["results"][0]["place_id"]

    if @trip.save
      @destination_start = Destination.new
      @destination_end = Destination.new
      @destination_here = Destination.new
      @destination_start.name = params[:trip][:start_location_city] + ", " + params[:trip][:start_location_state]
      @destination_start.trip_id = @trip.id
      @destination_start.place_id = res1["results"][0]["place_id"]
      @destination_start.lat = res1["results"][0]["geometry"]["location"]["lat"]
      @destination_start.lng = res1["results"][0]["geometry"]["location"]["lng"]
      @destination_end.name = params[:trip][:end_location_city] + ", "+ params[:trip][:end_location_state]
      @destination_end.trip_id = @trip.id
      @destination_end.place_id = res2["results"][0]["place_id"]
      @destination_end.lat = res2["results"][0]["geometry"]["location"]["lat"]
      @destination_end.lng = res2["results"][0]["geometry"]["location"]["lng"]
      @destination_here.name = "Here and Now"
      @destination_here.trip_id = @trip.id
      @destination_here.place_id = "hereAndNow"
      @destination_here.save
      @destination_start.save
      @destination_end.save
      redirect_to user_trip_path(current_user.id, @trip.id)
    else
      redirect_to root_path
    end
  end

  def show
    @trip = Trip.includes(:posts, :destinations, :events).find(params[:id])
    @post = Post.new
    @event = Event.new
    @waypoints = @trip.destinations.map { |e| e.name }
    @time = @trip.posts.map { |e| {title: e.title, content: e.content, time: e.created_at.strftime('%A %B %y')}}
    respond_to do |format|
      format.html
      format.json {render json: @trip, include: [:posts, :destinations, :events]}
    end
  end

  def edit
    @trip = Trip.find(params[:id])
  end

  def update
    @trip = Trip.find(params[:id])
    if @trip.update(trip_params)
      redirect_to user_trip_path(@trip.user_id, @trip.id)
    else
      render :edit
    end
  end

  def destroy
    if Trip.find(params[:id]).destroy
      redirect_to root_path
    else
      render :show
    end
  end

  private

  def trip_params
    params.require(:trip).permit(:name, :start_location, :end_location, :start_date, :end_date, :start_place_id, :end_place_id, :finished)
  end

  def destination_params
    params.require(:destination).permit(:name, :trip_id, :place_id, :lat, :lng)
  end

end
