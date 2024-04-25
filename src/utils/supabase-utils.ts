import { supabase } from "supabase";

export const fetchFileFromStorage = async (
  filePath: string,
  bucketName: string
): Promise<string | ArrayBuffer | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName) // Replace with your storage bucket name
      .download(filePath); // Path or URL of the file within the bucket

    if (error) {
      throw error;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(data);
      fileReader.onloadend = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  } catch (error) {
    console.error("Error downloading file");
    return null;
  }
};
