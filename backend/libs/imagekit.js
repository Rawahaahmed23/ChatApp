import ImageKit ,{toFile } from "@imagekit/nodejs"

const client = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE,
});

function hasImagekitConfig(){
    return Boolean (process.env.IMAGE_KIT_PRIVATE)
}

// This helper makes a safe, unique filename for uploaded files
function createFileName(originalName = "upload") {
  const safeName = originalName.replace(/[^a-z0-9.-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
     const filename = createFileName(file.originalName)

     const result = await client.files.upload({
        file: await toFile(file.buffer,filename,{type:file.mimetype}),
        fileName: 'fileName',
        folder: '/chat'

     })
     return result.url
}
export {uploadChatMedia,hasImagekitConfig}