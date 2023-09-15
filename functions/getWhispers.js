import formatRelativeDate from './utils/formateDate.js';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_KEY });

const database_id = process.env.NOTION_DATABASE_ID;

exports.handler = async (event, context) => {
  const { queryStringParameters } = event;

  const res = await notion.databases.query({
    database_id,
    page_size: 2,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    start_cursor: queryStringParameters.next_cursor,
  });
  const { results, next_cursor, has_more } = res;

  let html = results
    .map(
      (whisper) =>
        `<article id="post">
          <p>${whisper.properties.whisper.title[0].plain_text}</p>
          <small>${formatRelativeDate(whisper.created_time)}</small>
          <button class="delete-btn" 
          hx-delete=".netlify/functions/deleteWhisper?id=${whisper.id}" 
          _="on htmx:confirm(issueRequest)
          halt the event
          call Swal.fire({title: 'Are you sure?',  showCancelButton: true,
          confirmButtonText: 'Delete'})
          if result.isConfirmed issueRequest()"
          hx-trigger="click"
          hx-target="#post"
          hx-swap="outerHTML"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="24px" height="24px"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-5v2h1v15c0,0.52222 0.19133,1.05461 0.56836,1.43164c0.37703,0.37703 0.90942,0.56836 1.43164,0.56836h10c0.52222,0 1.05461,-0.19133 1.43164,-0.56836c0.37703,-0.37703 0.56836,-0.90942 0.56836,-1.43164v-15h1v-2h-5l-1,-1zM7,5h10v15h-10zM9,7v11h2v-11zM13,7v11h2v-11z"></path></g></g></svg></button>
        </article>`
    )
    .join('');

  if (has_more) {
    html += `<button hx-post="/.netlify/functions/getWhispers?next_cursor=${next_cursor}"
    hx-trigger="click"
    hx-target="this"
    hx-swap="outerHTML">more whispers</button>`;
  }

  return {
    statusCode: 200,
    body: html,
  };
};
