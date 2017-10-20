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

  if response.body == '[]'
    nil
  else
    parse_response(response.body).to_json # Parsed body
  end
end

# helpers

def parse_response(response)
  products = JSON.parse(response)
  products.each_pair.map do |product_id, items|
    items.map do |item|
      fixed_item =
        if item.is_a? Array
          item[1]
        else
          item
        end
      {
        id: product_id,
        size: fixed_item["size_text"],
        qty: fixed_item["quantity"]
      }
    end
  end.flatten
end