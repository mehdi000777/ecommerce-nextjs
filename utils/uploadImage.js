export const uploadImage = async (images) => {
    let imgArr = [];

    for (const item of images) {
        const formData = new FormData();
        formData.append("file", item);
        formData.append("upload_preset", process.env.CLOUD_UPLOAD_PRESET);
        formData.append("cloud_name", process.env.CLOUD_NAME);

        const res = await fetch(process.env.CLOUD_API, {
            method: "POST",
            body: formData
        })

        const data = await res.json();
        imgArr.push({ url: data.secure_url, public_id: data.public_id })
    }

    return imgArr;
}