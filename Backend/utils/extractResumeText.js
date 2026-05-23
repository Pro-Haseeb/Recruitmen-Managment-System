import fs from "fs";
// import pkg from "pdf-parse";
import * as pdfjsLib from  "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

export const extractResumeText = async (file)=> {
  try{
   
    if(file.mimetype === "application/pdf"){
     const data = new Uint8Array(
       fs.readFileSync(file.path)
     );
     
     const pdf = await pdfjsLib.getDocument({
      data,
     }).promise;

     let text = "";

       for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        const strings = content.items.map(
          (item) => item.str
        );

        text += strings.join(" ");
      }

      return text;
    }

    if(file.mimtype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    {
      const result = await mammoth.extractRawText({
        path : file.path
      });

      return result.value;
    }

    return "";
  }
  catch(error){
      console.log(error);

      return "";
  }
};


// import fs from "fs";
// import pdf from "pdf-parse";
// import mammoth from "mammoth";

// export const extractResumeText = async (file) => {

//   try {

//     // PDF
//     if (file.mimetype === "application/pdf") {

//       const dataBuffer = fs.readFileSync(file.path);

//       const data = await pdf(dataBuffer);

//       return data.text;
//     }

//     // DOCX
//     if (
//       file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {

//       const result = await mammoth.extractRawText({
//         path: file.path,
//       });

//       return result.value;
//     }

//     return "";

//   } catch (error) {

//     console.log(error);

//     return "";
//   }
// };
