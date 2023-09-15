import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_KEY });

exports.handler = async (event, context) => {
  await notion.pages.update({
    page_id: event.queryStringParameters.id,
    archived: true,
  });

  return {
    statusCode: 200,
    body: '',
  };
};
