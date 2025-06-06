import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {   
      title,
      description,
      price,
      discount,
      img,
      category,
      subcategory,
      colors,
      sizes,
      names,
      stock,
      arrival,
      video,
      delivery,
      brand,
      points,
      isOut,
      } = body;

console.log("body are: ",body);



    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        discount,
        img,
        category,
        subcategory,
        colors,
        sizes,
        names,
        stock,
        arrival,
        video,
        delivery,
        brand,
        points,
        isOut,
      },
    });

    

    return new Response(JSON.stringify({ message: 'Product created successfully', product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'desc', // Sort by latest id first
      },
    });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

