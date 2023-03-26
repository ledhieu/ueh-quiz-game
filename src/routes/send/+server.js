import { SECRET_BEARER_TOKEN, SECRET_API_URL } from '$env/static/private'
import { json } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export async function POST({ request }) {
  // do something
  const mssv = await request.json().then(req => req.mssv)
  console.log(mssv)
  console.log(SECRET_API_URL, SECRET_BEARER_TOKEN)
  try{
    fetch(SECRET_API_URL, {
          method:'POST', 
          headers: {
            'Authorization': `Bearer ${SECRET_BEARER_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: [
              {
                'id': "INCREMENT",
                'MSSV': mssv,
                'Thời gian': "DATETIME "
              }
            ]
          })
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        
      });
  } catch(err){
    console.log(err)
  }

  return new Response(JSON.stringify({
    message: 'success'
  }, {status: 200}))
}