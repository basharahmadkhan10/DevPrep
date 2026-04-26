import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import app from "./src/app.js";
import connectDB from "./src/db/index.js";

connectDB()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Server is running at http://localhost:${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});


