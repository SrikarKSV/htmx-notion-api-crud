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
        `<article>
          <p>${whisper.properties.whisper.title[0].plain_text}</p>
          <small>${formatRelativeDate(whisper.created_time)}</small>
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
