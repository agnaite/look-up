require 'sinatra'
require 'requests'

set :root, File.join(File.dirname(__FILE__), '..')
set :views, Proc.new { File.join(root, "views") }

enable :sessions

get '/' do
  erb :index
end

get '/get_products' do
  @products = params[:products]

  response = Requests.request("GET", "https://www.dollskill.com/api/v1/catalog/products/"+@products,
                              params: { :op => "get_size_attributes" })

  response.body # Parsed body
end
