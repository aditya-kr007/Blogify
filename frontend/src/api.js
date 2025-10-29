import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_SERVER_DOMAIN+"/editor",
});

export const postImage = (data) =>
	API.post("/", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});


	const API2 = axios.create({
		baseURL: import.meta.env.VITE_SERVER_DOMAIN+"/editor",
	});
	
	export const postImage2 = (data) =>
		API2.post("/", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	