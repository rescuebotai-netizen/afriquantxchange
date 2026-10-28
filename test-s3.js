import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

const s3 = new S3Client({
  endpoint: 'https://files.massive.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'A2a0a8e9-668c-4b69-a308-fdebec441fad',
    secretAccessKey: '3v22mB2LR5GUt_peThpYAmsnV1WCpd6S'
  },
  forcePathStyle: true,
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
  }),
});

async function test() {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: 'flatfiles' }));
    console.log('Objects:', data.Contents?.map(c => c.Key));
  } catch (e) {
    console.error('List error:', e);
  }
}

test();
