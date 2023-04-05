import { SECRET_BEARER_TOKEN, SECRET_API_URL } from '$env/static/private'
import { json } from '@sveltejs/kit';
import  { google } from 'googleapis'

/** @type {import('./$types').Actions} */
export async function POST({ request }) {
  // do something
  const mssv = await request.json().then(req => req.mssv)
  let failed = true;
  console.log(mssv)
  console.log(SECRET_API_URL, SECRET_BEARER_TOKEN)
  try{
    await fetch(SECRET_API_URL, {
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
        console.log('data', data)
        if(!data.error){
          failed = false
        }
        else{
          failed = data.error
        }

      });
  } catch(err){
    console.log('error', err.message)
    failed = err.message
  }
  // read('https://docs.google.com/spreadsheets/d/1ecBZ-8d5BBc-B0ajHJnWg5SHTe3sDIikxAQj1MfqqWY/edit#gid=0',
  // 'A1:C3', () => {console.log('success')})
  if(failed)
    return new Response(JSON.stringify({
      message: failed,
      status: 400
    }))
  return new Response(JSON.stringify({
    message: 'success',
    status: 200
  }))
}

async function read(spreadsheetId, range, callback) {
    try {
      //Function for authentication object
      const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      //Create client instance for auth
      const authClient = await auth.getClient();

      const sheets = google.sheets({version: 'v4', authClient});
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
      console.log(res)
    } catch (err) {
      console.log(err.message);
      return;
    }
}