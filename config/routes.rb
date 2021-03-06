Rails.application.routes.draw do
  devise_for :users, :controllers => {:registrations => "users/registrations"}
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'homes#index'
  resources :users do
    resources :trips, defaults: {format: :json}, only: [:index]
    resources :trips, except: [:index] do
      resources :destinations, defaults: {format: :json} do
        resources :events, defaults: {format: :json}
      end
      resources :posts, defaults: {format: :json}
    end
  end

  # Example of regular route:
  get 'trips/new' => 'trips#new'
  get '/find_places' => 'trips#find_places'
  get '/show_info' => 'trips#show_info'
  get '/gas_info' => 'trips#gas_info'
  post '/users/:user_id/trips/:trip_id/destinations/:destinations_id/events/:id' => 'events#destroy'
  post 'users/:userId/trips/:id/finished' => 'trips#finished'
  post '/users/:user_id/trips/:trip_id/posts/:id' => 'posts#update'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
