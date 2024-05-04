//server.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const { Stream } = require('nodemailer/lib/xoauth2');
const { Timestamp } = require('mongodb');
const schedule = require('node-schedule'); // Import node-schedule
require('dotenv').config(); // Load environment variables from .env file
const { PDFDocument, rgb, values } = require('pdf-lib');
const fs = require('fs');
const path = require("path");
const jwt = require('jsonwebtoken');


 

app.use(cors());
app.use(express.json()); // To parse JSON bodies
         
 
mongoose
.connect(
  "mongodb+srv://once2666:Ae3Exs8ciPhFMhSe@cluster0.qlcosvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("mongodb connected"))
.catch((err) => console.log("mongo error", err));





const ContactSchema = new mongoose.Schema({
  yourname: {
  type: String,
  require: true,
  },
  youremail: {
  type: String,
  require: true,
  },
  yoursub: {
  type: String,
  require: true,
  },
  yourmessage: {
  type: String,
  require: true,
  },
  });
 
  const User = mongoose.model("contacts", ContactSchema)

  const registerSchema = new mongoose.Schema({
    name: {
    type: String,
    require: true,
    },
    mobile: {
    type: String,
    require: true,
    },
    email: {
    type: String,
    require: true,
    },
    password: {
    type: String,
    require: true,
    },
    });
  
    const UserRegister = mongoose.model("registers", registerSchema);

      const Taxi_booked = new mongoose.Schema({
        name: {
        type: String,
        require: true,
        },
        email: {
        type: String,
        require: true,
        },
        mobile: {
        type: Number,
        require: true,
        },
        selecttaxi: {
        type: String,
        require: true,
        },
        numofpass: {
        type: Number,
        require: true,
        },
        pickuppoint: {
        type: String,
        require: true,
        },
        droppoint: {
        type: String,
        require: true,
        },
        pickupdate: {
        type: Date,
        require: true,
        },
        pickuptime: {
        type: String,
        require: true,
        },
        numofbags: {
        type: Number,
        require: true,
        },
        });
    
      const Booktaxi = mongoose.model("Taxi_booked", Taxi_booked);

      const vehicle_register = new mongoose.Schema({
        name: {
        type: String,
        require: true,
        },
        email: {
        type: String,
        require: true,
        },
        mobile: {
        type: Number,
        require: true,
        },
        carname: {
        type: String,
        require: true,
        },
        carmodel: {
        type: String,
        require: true,
        },
        licensenumber: {
        type: String,
        require: true,
        },
        vehicleyear: {
        type: String,
        require: true,
        },
        vehiclecolor: {
        type: String,
        require: true,
        },
        city: {
        type: String,
        require: true,
        },
        puc:{
          type:Boolean,
          require:true,
        },
        drivinglicense:{
          type:Boolean,
          require:true,
        },
        rcbook:{
          type:Boolean,
          require:true,
        },
        });
    
      const vehicle = mongoose.model("Registered_vehicle",vehicle_register );

      // const book = await Booktaxi.findOne({ pickuppoint });
      // const driver = await vehicle.findOne({city});


      app.get("/api/location", (req, res) => {
        const filePath = path.join(__dirname, 'Location.json');
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        });
      });
      
      app.get("/api/feedback", (req, res) => {
        const filePath = path.join(__dirname, "feedback.json");
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        });
      });
      
      app.get("/api/taxitype", (req, res) => {
        const filePath = path.join(__dirname, "taxitype.json");
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        });
      });
      
      app.get("/api/driver", (req, res) => {
        const filePath = path.join(__dirname, "driver.json");
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        });
      });
      
      app.get("/api/ourservicee", (req, res) => {
        const filePath = path.join(__dirname, "ourservicee.json");
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        });
      });
      
      app.get("/api/service", (req, res) => {
        const filePath = path.join(__dirname, "service.json");
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        });
      });

  app.post('/contact', async(req, res) => {
    const { yourname, youremail, yoursub, yourmessage } = req.body;
  
    try {
      // Check if there is already a contact with the same email and subject
      const existingContact = await User.findOne({ youremail, yourmessage });
  
      if (existingContact) {
        // If a contact already exists, send an alert to the client
        return res.json({ success: false, error: 'You have already sent a message with the same email and subject.' });
      }
  
      // Create a Nodemailer transporter
      
  
      // Save the contact information to the database
      const data = await User.create({ yourname, youremail, yoursub, yourmessage });
      
console.log(data)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Define email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: youremail,
        subject: 'Welcome to Smart Cab Point',
        html: `
          <p>Hello ${yourname}</p>
          <p>Thank you for contacting with Smart Cab Point. We are excited to have you on board!</p>
          <p>Best regards,</p>
          <p>Smart Cab Point Team</p>
        `,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
  
      // // Send a JSON response to the client
      // res.json({ success: true, message: 'Registration successful. Welcome email sent.' });


      const mail = {
        from: process.env.EMAIL_USER,
        to: 'vanshksheth@gmail.com',
        subject: 'Welcome to Smart Cab Point',
        html: `
          <p>Hello Vansh</p>
          <p>${yourname} tried to contact on a Smart Cab Point.</p>
          <p>Best regards,</p>
          <p>Smart Cab Point Team</p>
        `,
      };
  
      // Send the email
      const inf = await transporter.sendMail(mail);
      console.log('Email sent:', inf.response);
  
      // Send a JSON response to the client
      res.json({ success: true, message: 'Registration successful. Welcome email sent.' });
    } catch (error) {
      console.error('Error:', error);
      // Send a JSON response to the client if an error occurs
      res.json({ success: false, error: 'Failed to process your request.' });
    }
  


});

app.get("/contactinfo", async (req, res) => {
  try {
    const contacts = await User.find();
    res.json({ success: true, data:contacts });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});




//get register data

app.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;




  try {

  // Check if the user with the given email already exists
  const user = await UserRegister.findOne({ email,password });
 

  if (user) {
    // If user exists, return an error response
    return res.json({ success: false, error: 'you already have an account please go to login page' });
  }
  


  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword)

    const result = await UserRegister.create({
name,
email,
mobile,
password:hashedPassword,

});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Define email options
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Welcome to Smart Cab Point',
  html: `
    <p>Hello ${name}</p>
    <p>Thank you for contacting with Smart Cab Point. We are excited to have you on board!</p>
    <p>Best regards,</p>
    <p>Smart Cab Point Team</p>
  `,


};

const info =  await transporter.sendMail(mailOptions);
console.log('Email sent:', info.response);


const mail = {
  from: process.env.EMAIL_USER,
  to: 'vanshksheth@gmail.com',
  subject: 'Welcome to Smart Cab Point',
  html: `
    <p>Hello Vansh</p>
    <p>${name} have registered on a Smart Cab Point.</p>
    <p>Best regards,</p>
    <p>Smart Cab Point Team</p>
  `,


};

const inf =  await transporter.sendMail(mail);
console.log('Email sent:', inf.response);

res.json({ success: true, message: 'added' });
console.log(result);






}catch (error) {
  res.json({ success: false, error: 'not added' });
}

})

  

app.get("/Register-info", async (req, res) => {
  try {
    const register = await UserRegister.find();
    res.json({ success: true, data:register });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve data' });
  }
});




//get register data

app.post('/book-cab', async (req, res) => {
  const { name,email,mobile,selecttaxi,numofpass,pickuppoint,droppoint,pickupdate,pickuptime,numofbags } = req.body;




  // if (book == driver){
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
    
    
    // Define email options
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Welcome to Smart Cab Point',
    //   html: `
    //     <p>Hello ${name}</p>
    //     <p>Thank you for contacting with Smart Cab Point. We are excited to have you on board!</p>
    //     <p>Best regards,</p>
    //     <p>Smart Cab Point Team</p>
    //   `,
    
    
    // };
    
    // const info =  await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info.response);

  // }
  
  try {
    const result = await Booktaxi.create({
      name,
      email,
      mobile,
      selecttaxi,
      numofpass,
      pickuppoint,
      droppoint,
      pickupdate  ,
      pickuptime,
      numofbags,
});
try {
  // Load existing PDF
  const existingPdfPath = './bookingform.pdf';
  const existingPdfBytes = fs.readFileSync(existingPdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
// Modify existing PDF
const page = pdfDoc.getPage(0); // Assuming the text is on the first page
page.drawText(name, { x:157, y: 618, size: 12, color: rgb(0, 0, 0) });
page.drawText(email, { x:157, y: 581, size: 12, color: rgb(0, 0, 0) });
page.drawText(mobile, { x:157, y: 543, size: 12, color: rgb(0, 0, 0) });
page.drawText(selecttaxi, { x:157, y:505, size: 12, color: rgb(0, 0, 0) });
page.drawText(numofpass, { x:157, y: 467, size: 12, color: rgb(0, 0, 0) });
page.drawText(pickuppoint, { x:157, y: 429, size: 12, color: rgb(0, 0, 0) });
page.drawText(droppoint, { x:157, y: 392, size: 12, color: rgb(0, 0, 0) });
page.drawText(pickupdate, { x:157, y: 353, size: 12, color: rgb(0, 0, 0) });
page.drawText(pickuptime, { x:157, y: 315, size: 12, color: rgb(0, 0, 0) });
page.drawText(numofbags, { x:157, y: 276, size: 12, color: rgb(0, 0, 0) });  



  const modifiedPdfBytes = await pdfDoc.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  // Define email options
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Your cab is booked',
  html: `
    <p>Hello ${name}</p>
    <p>Thank you for Booking a cab on Smart cab point. We are excited to have you on board!</p>
    <p>Best regards,</p>
    <p>Smart Cab Point Team</p>
  `,
  attachments: [
    {
        filename: 'bookingform.pdf',
        content: modifiedPdfBytes
    }
]


};

const info =  await transporter.sendMail(mailOptions);
console.log('Email sent:', info.response);



const mail = {
  from: process.env.EMAIL_USER,
  to:'vanshksheth@gmail.com',
  subject: 'Welcome to Smart Cab Point',
  html: `
    <p>Hello Vansh</p>
    <p>${name} have recently booked a Cab on Smart Cab Point.</p>
    <p>Best regards,</p>
    <p>Smart Cab Point Team</p>
  `,


};

const inf =  await transporter.sendMail(mail);
console.log('Email sent:', inf.response);


}

catch(error){
  console.log('Error sending mail',error)
}


res.json({ success: true, message: 'added' });
console.log(result);

} catch (error) {
    res.json({ success: false, error: 'not added' });
}


});


app.get("/cabinfo", async (req, res) => {
  try {
    const cab = await Booktaxi.find();
    res.json({ success: true, data:cab });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve data' });
  }
});






// Update your login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

 try {
  const user = await UserRegister.findOne({ email });

    if (!user) {
      return res.json({ success: false, error: 'Invalid email' });
    }


    
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid  password' });
}

const token = jwt.sign({ email }, 'secret-key', { expiresIn: '10h' });
          
console.log(token)
console.log(user.name)

// Return user data (in this case, just the name)
    res.json({ success: true,data:token});
 } catch (error) {
  console.error('Error during login:', error);
 }
// Check if the user with the given email exists

});



app.post('/register-vehicle', async (req, res) => {
  const { name,email,mobile,carname,carmodel,licensenumber,vehicleyear,vehiclecolor,city,puc,drivinglicense,rcbook } = req.body;
      // Save the contact information to the database
      const data = await vehicle.create({name,email,mobile,carname,carmodel,licensenumber,vehicleyear,vehiclecolor,city,puc,drivinglicense,rcbook});
      
console.log(data)
try{
  const data = await vehicle.create({name,email,mobile,carname,carmodel,licensenumber,vehicleyear,vehiclecolor,city,puc,drivinglicense,rcbook});
      
  console.log(data)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Smart Cab Point',
    html: `
      <p>Hello ${name}</p>
      <p>Thank you for registering your vehicle on Smart Cab Point. We are excited to have you on board!</p>
      <p>Best regards,</p>
      <p>Smart Cab Point Team</p>
    `,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);


  const mail = {
    from: process.env.EMAIL_USER,
    to: "once.559.cse@gmail.com",
    subject: 'Vehicle register details',
    html: `
      <p>Hello,</p>
      <p>${name} Have registered their vehicle on the Smart cab Point.</p>
      <p>driver name   : ${name}</p>
      <p>E-mail        : ${email}</p>
      <p>Mobile no.    : ${mobile}</p>
      <p>Car Name      : ${carname}</p> 
      <p>Car Model     : ${carmodel}</p>
      <p>License Number: ${licensenumber}</p>
      <p>City          : ${city},</p>
      <p>Best regards,</p>
      <p>Smart Cab Point Team</p>
    `,
  
  
  };
  
  const inf =  await transporter.sendMail(mail);
  console.log('Email sent:', inf.response);
  // Send a JSON response to the client
  res.json({ success: true, message: 'Registration successful. Welcome email sent.' });
} catch (error) {
  console.error('Error:', error);
  // Send a JSON response to the client if an error occurs
  res.json({ success: false, error: 'Failed to process your request.' });
}



      
})

app.get("/registervehicle", async (req, res) => {
  try {
    const vehiclereg = await vehicle.find();
    res.json({ success: true, data:vehiclereg });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});

app.listen(2666, () => {
console.log('Server connected');
});


// // Schedule job for sending emails
// schedule.scheduleJob('49 12 * * *,0', async () => {
//   try {
//     // const users = await UserRegister.find();

   
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: "veer2238rajput@gmail.com",
//         subject: 'Welcome to Smart Cab Point',
//         html: 'hi',
//       };

//       const info = await transporter.sendMail(mailOptions);
//       console.log('Email sent:', info.response);
//       console.log('Emails sent successfully');

//   } catch (error) {
//     console.error("Error sending emails:", error);
//   }
// });