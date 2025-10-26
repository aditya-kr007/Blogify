import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Image, { ImageTool } from '@editorjs/image'
import Header from '@editorjs/header'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'
import InlineCode from '@editorjs/inline-code'
import { postImage} from '../api'


const uploadImageUrl=(e)=>{
    let link=new Promise((resolve,reject)=>{
        try {
            resolve(e)
        } catch (error) {
            reject(e)
        }
    })
    return link.then((url)=>{
        return {
            success: 1,
            file:{url}
        }
    })
}
<script>
const ImageTool = window.ImageTool;
</script>

const uploadImageByFile=async(e)=>{
    const res= await postImage(e)
    console.log(res)
}

export const tools = {
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading..",
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            // uploader:{
            //     uploadByUrl:uploadImageUrl,
            //     uploadByFile:uploadImageByFile
            // }
            endpoints:{
                // byUrl:uploadImageUrl,
                byFile:import.meta.env.VITE_SERVER_DOMAIN+"/editor"
            }
            
        }
    },
    embed: Embed,
    marker: Marker,
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    inlineCode: InlineCode,
}

 // return fetch('https://api.cloudinary.com/v1_1/dulj1z53g/image/upload', {
    //     method: 'POST',
    //     body: data
    // })
//    .then(response => response.json())