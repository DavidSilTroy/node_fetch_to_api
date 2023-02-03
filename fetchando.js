///This file is only to test the fetching..
import fetch from 'node-fetch';
import fs from "fs";
import colors from 'colors';




import sharp from "sharp";

//Just to have an idea of the time it takes every request
const getTime = () => {
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
};

//In case you want to save the result or something in txt format
const saveData = (text, fileName) => {
    fs.promises.appendFile(`${fileName}.txt`, text, function(err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

//Giving the body the format it has to have
const formBody = (base64String) => {
    var details = {
        'base64image': `data:image/jpeg;base64,${base64String}`
    };

    var formBody = [];

    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    return formBody;
};


//Making the request to the url defined and with the image in base64 format
const makeRequestBase64Img = async(url, base64Image) => {

    let newBody = formBody(base64Image);

    let data = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: newBody
    });
    data = await data.text();

    return data;
};

//Getting the file to then send it in the request
const readFromImageFile = async(url, fileName) => {
    let thefile = await fs.promises.readFile(fileName, async(err, data) => {
        if (err)
            throw err;
        return data;
    });
    let result = await sharp(thefile)
        .toFormat("jpg")
        .toBuffer()
        .then(async(data) => {
            const base64Image = data.toString("base64");
            // saveData(base64Image, "ImageBase64");
            // await splitImage(base64Image);
            let response = await makeRequestBase64Img(url, base64Image);
            return (`${getTime()} --> ${response}`);


        })
        .catch(err => {
            throw err;
        });

    return result;
}


const StartRequests = async() => {
    //Possible URLs
    let url_1 = 'https://nodebackendproject.azurewebsites.net/phone-big-img?';
    let url_2 = 'https://nodebackendproject.azurewebsites.net/drone-big-img?';
    let url_3 = 'https://nodebackendproject.azurewebsites.net/drone-big-img/yolov5?';
    let url_4 = 'https://nodebackendproject.azurewebsites.net/drone-big-img/roboflow?';
    let url_5 = 'https://nodebackendproject.azurewebsites.net/drone-big-img/yolov5-cropped?';
    let url_6 = 'https://nodebackendproject.azurewebsites.net/drone-big-img/roboflow-cropped?';
    // let url_1 = 'http:localhost:8080/phone-big-img?';
    // let url_2 = 'http:localhost:8080/drone-big-img?';
    // let url_3 = 'http:localhost:8080/drone-big-img/yolov5?';
    // let url_4 = 'http:localhost:8080/drone-big-img/roboflow?';

    const phonePicture = "phonetest.jpg";
    const dronePicture = "dronetest.jpg";
    const droneSubPicture = "dronetest-sub-1.jpg";

    console.log(`\n\n\n Starting at ${getTime()}`);

    console.log('This is okay!'.green);

    console.log(await readFromImageFile(url_1, phonePicture));
    console.log(await readFromImageFile(url_5, droneSubPicture));
    console.log(await readFromImageFile(url_6, droneSubPicture));
    console.log(await readFromImageFile(url_3, dronePicture));
    console.log(await readFromImageFile(url_2, dronePicture));
    console.log(await readFromImageFile(url_4, dronePicture));

    console.log(`\n End at ${getTime()} \n\n`);
}

StartRequests();



colors.enable()

// console.log('Error!'.underline.red);
// console.log('Warning!'.red);