import 'dotenv/config';
import {createApp} from './app';
const port=Number(process.env.API_PORT || 3001);
createApp().listen(port,'127.0.0.1',()=>console.log('京途 AI API 已启动：http://127.0.0.1:'+port));
