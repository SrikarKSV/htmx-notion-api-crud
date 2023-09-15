import formatRelativeDate from './utils/formateDate.js';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_KEY });

const database_id = process.env.NOTION_DATABASE_ID;

exports.handler = async function saveWhisper(event, context) {
  const { body } = event;
  const whisper = new URLSearchParams(body).get('whisper');

  const data = {
    parent: {
      type: 'database_id',
      database_id: database_id,
    },
    properties: {
      whisper: {
        title: [
          {
            text: {
              content: whisper,
            },
          },
        ],
      },
    },
  };

  const {
    properties: {
      whisper: { title },
    },
    created_time,
  } = await notion.pages.create(data);

  const html = `
    <article>
        <p>${title[0].plain_text}</p>
        <small>${formatRelativeDate(created_time)}</small>
    </article>`;

  return {
    statusCode: 200,
    body: html,
  };
};
