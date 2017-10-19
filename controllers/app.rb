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

  parse_response(response.body).to_json # Parsed body
end

# helpers

def parse_response(response)
  products = JSON.parse(response)
  parsed_products = {}

  for product in products.keys
    parsed_products[product] = []
    for item in products[product]
      if item.is_a? Array
        parsed_products[product] <<  {size: item[1]["size_text"]}
        parsed_products[product] <<  {qty: item[1]["quantity"]}
      else
        parsed_products[product] <<  {size: item["size_text"]}
        parsed_products[product] <<  {qty: item["quantity"]}
      end
    end

  end
  parsed_products
end