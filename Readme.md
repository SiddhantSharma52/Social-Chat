Social Chat - MERN Stack Project
Social Chat is a full-stack MERN (MongoDB, Express, React, Node.js) project users with a social media platform to connect and interact with each other. The project includes features such as user authentication, posting messages, uploading images and videos, following other users, and more.

Features
User authentication using email and password
OAuth2 authentication with Google
Posting messages with images and videos
Cloudinary integration for media storage
Following and unfollowing other users
Real-time notifications
Email verification
Responsive and user-friendly UI
Installation
Clone the repository to your local machine.
Install the dependencies using the following command:
bash
Copy code
npm install
Create a .env file in the root directory and add the following environment variables:
plaintext
Copy code
# PORT
PORT=9000
SESSION_SECRET= <your SESSION_SECRET'>

# MongoDB
MONGO_URL=mongodb+srv://<your-mongodb-connection-string>/Social_Media
# For local development: MONGO_URL=mongodb://127.0.0.1:27017/socialmedias

# Cloudinary
SECRET_CLOUD_NAME=<your-cloudinary-cloud-name>
SECRET_API_KEY=<your-cloudinary-api-key>
SECRET_API_SECRET=<your-cloudinary-api-secret>

# Passport-google
SECRET_CLIENTID=<your-google-client-id>
SECRET_CLIENTSECRET=<your-google-client-secret>
SECRET_CALLBACKURL=http://localhost:8000/user/auth/google/callback

# Send-Email
EMAIL_PORT=2525
USER_EMAIL=<your-sending-email>
PASSWORD=<your-sending-email-password>
FROM_EMAIL=<your-sending-email>
Start the development server:
bash
Copy code
npm start
Visit http://localhost:9000 in your web browser to access the application.
Folder Structure
The project's folder structure is organized as follows:

markdown
Copy code
- src
  - components
  - controllers
  - middleware
  - models
  - routes
  - utils
  - views
- public
- server.js
- .env
- package.json
- README.md
Contributions
Contributions to this project are welcome! If you find any bugs or have suggestions for improvements, please feel free to open an issue or submit a pull request.