require('dotenv');
const Airtable= require("airtable-node");

const airtable= new Airtable({apiKey:process.env.AIRTABLE_API_KEY})
.base(process.env.AIRTABLE_BASE_PRODUCTS)
.table('products')


exports.handler=async (event, context)=> {
    
    let { id }= event.queryStringParameters;
    console.log(id);
    if(id) {
        try {
            let product=await airtable.retrieve(id);
            if(product.error) {
                return {
                    statusCode:200,
                    body: `no product found with ${id}`
                }                
            }
            return {
                statusCode:200,
                body: JSON.stringify(product)
            }
        } catch (error) {
            return {
                statusCode:500,
                body: `no product found with ${id}`
            }
        }

    }

    try {
        let {records}= await airtable.list();
        let products= records.map(item=> {
            let {id, fields}= item;
            let {Price, Category, Description, Company, Name, Image, Rating}= fields;
    
            return {
                id, Price, Category, Description, Company, Name, Image, Rating 
            }
        })
        return {
            statusCode:200,
            body: JSON.stringify(products)
        }   
    } catch (error) {
        return {
            statusCode: 404,
            body:error
        }
    }
}