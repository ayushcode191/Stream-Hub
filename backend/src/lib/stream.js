import {StreamChat} from "stream-chat";
import "dotenv/config";

const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apikey || !apiSecret){
    console.log("Stream API  key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};


// ToDo : do it later
export const generateStreamToken = (userId) => {

}