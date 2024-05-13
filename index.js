//server.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');

require('dotenv').config(); 
// const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require("path");
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
         
 
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
    type: Number,
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

   book: [
    {
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
      currentDate: {
        type: Date,
        require: true,
        }
    }
    ]
    });
  
    const UserRegister = mongoose.model("registers", registerSchema);

    
    
 

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
        }
    
        });
    
      const vehicle = mongoose.model("Registered_vehicle",vehicle_register );




      app.get("/api/location", (req, res) => {
        const filePath = path.join(__dirname, 'Location.json');
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
      
          const jsonData = JSON.parse(data);
          res.json({success:true,data:jsonData});
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


      // for contact post

  app.post('/contact', async(req, res) => {
    const { yourname, youremail, yoursub, yourmessage } = req.body;
  
    try {
      // Check if there is already a contact with the same email and subject
      const existingContact = await User.findOne({ youremail, yourmessage });
  
      if (existingContact) {
        // If a contact already exists, send an alert to the client
        return res.json({ success: false, error: 'You have already sent a message..' });
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
        subject: 'smart cab point',
        html: `
    <div style="background-color: #f3f3f3; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
          <p style="color: #333; font-size: 18px;">Dear Customer,</p>
          <p style="color: #333; font-size: 16px;">Thank you for contacting Smart Cab Point!</p>
          <p style="color: #333; font-size: 16px;">Below is the information you requested:</p>
          <hr style="border: 1px solid #ccc;">
          <div style="margin-top: 20px;">
              <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
              <ul style="list-style-type: none; padding-left: 0;">
                  <li><strong>Name:</strong> veer</li>
                  <li><strong>Email:</strong> book@smartcabpoint.com</li>
                  <li><strong>Phone:</strong> +1-444-123-4559</li>
                  <li><strong>Message:</strong> will get back to you soon</li>
              </ul>
          </div>
          <hr style="border: 1px solid #ccc;">
          <p style="color: #333; font-size: 16px;">If you have any further questions or need assistance, feel free to contact us.</p>
          <p style="color: #666; font-size: 16px;">Best regards,</p>
          <p style="color: #666; font-size: 16px;">Smart Cab Point Team</p>
        
        
          <p style="color: #666; font-size: 16px; margin-top: 20px;"> Nizampura,Vadodara,india</p>
      </div>
  </div>
  
    `
     
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
  
     


      const mail = {
        from: process.env.EMAIL_USER,
        to: 'himanshu0409agraval@gmail.com',
        subject: 'Details',
        html: `
    <div style="background-color: #f3f3f3; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
         
          <div style="margin-top: 20px;">
              <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
              <ul style="list-style-type: none; padding-left: 0;">
                  <li><strong>Name:</strong> ${yourname}</li>
                  <li><strong>Email:</strong> ${youremail}</li>
                  <li><strong>subject:</strong> ${yoursub}</li>
                  <li><strong>Message:</strong> ${yourmessage}</li>
              </ul>
          </div>
         
      </div>
  </div>
  
    `
      };
  
     
      const inf = await transporter.sendMail(mail);
      console.log('Email sent:', inf.response);
  
     
      res.json({ success: true, message: 'Thanks Youe message has been sent!' });
    } catch (error) {
      console.error('Error:', error);
  
      res.json({ success: false, error: 'Failed to process your request.' });
    }
  


});

// for contact get
app.get("/contact-info", async (req, res) => {
  try {
    const contacts = await User.find();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});






//for register post

app.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  console.log(name,email,mobile,password)




  try {

  // Check if the user with the given email already exists
  const user = await UserRegister.findOne({email});
 

  if (user) {
   
    return res.json({ success: false, error: 'you already have an account, please login now' });
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


const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Welcome to Smart Cab Point',
  html: `
  <p>Hello ${name},</p>
  <p>Thank you for registering with Smart Cab Point. We are thrilled to welcome you to our community!</p>
  <p>As a member, you can enjoy exclusive offers, discounts, and updates on our latest offerings.</p>
  <p>Stay tuned for exciting news and events!</p>
  <p>Best regards,</p>
  <p>Smart Cab Point Team</p>
`,
};

const info =  await transporter.sendMail(mailOptions);
console.log('Email sent:', info.response);


res.json({ success: true, message: 'Thanks Registration successfull' });
console.log(result);






}catch (error) {
  res.json({ success: false, error: 'not added' });
}

})


// for register get
  
app.get("/register-info", async (req, res) => {
  try {
    const user = await UserRegister.find();
    res.json({ success: true, data: user });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});


// remover user data
app.post('/remove-from-register', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserRegister.findOneAndDelete({ email: email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// for login post

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  UserRegister.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.json({ success: false, error: 'Invalid email' });
      }

      bcrypt.compare(password, user.password)
        .then((passwordMatch) => {
          if (!passwordMatch) {
            return res.json({ success: false, error: 'Invalid password' });
          }

          const token = jwt.sign({ email }, 'secret-key', { expiresIn: '24h' });

          console.log(token);
          console.log(user.name);

          res.json({ success: true, message: 'Thanks Book Cab now', data: token, name: user.name });
        })
       
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
});






// for booking post

app.post('/book-cab', async (req, res) => {
  const { name,
    email,
    mobile,
    selecttaxi,
    numofpass,
    pickuppoint,
    droppoint,
    pickupdate,
    pickuptime,
    numofbags ,
    currentDate} = req.body;

    try {

      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, error: 'Token not provided' });
      }
  
      jwt.verify(token, 'secret-key', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ success: false, error: 'Invalid token' });
        }
  
  
        const user = await UserRegister.findOne({ email: decoded.email });
        if (!user) {
          return res.status(404).json({ success: false, error: 'User not found' });
        }


        // const matchingVehicles = await vehicle.find({ city: pickuppoint });
        // if (!matchingVehicles) {
        //   return res.status(404).json({ success: false, error: 'No vehicles available in the pickup city' });
        // }
  

  
  
        user.book.push({
          name,
          email,
          mobile,
          selecttaxi,
          numofpass,
          pickuppoint,
          droppoint,
          pickupdate,
          pickuptime,
          numofbags,
          currentDate
        });
  
        const userbook = await user.save();
  
        console.log(userbook)


//      // Load existing PDF
//   const existingPdfPath = './bookingform.pdf';
//   const existingPdfBytes = fs.readFileSync(existingPdfPath);
//   const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
// // Modify existing PDF
// const page = pdfDoc.getPage(0);
// page.drawText(name, { x:157, y: 618, size: 12, color: rgb(0, 0, 0) });
// page.drawText(email, { x:157, y: 581, size: 12, color: rgb(0, 0, 0) });
// page.drawText(mobile, { x:157, y: 543, size: 12, color: rgb(0, 0, 0) });
// page.drawText(selecttaxi, { x:157, y:505, size: 12, color: rgb(0, 0, 0) });
// page.drawText(numofpass, { x:157, y: 467, size: 12, color: rgb(0, 0, 0) });
// page.drawText(pickuppoint, { x:157, y: 429, size: 12, color: rgb(0, 0, 0) });
// page.drawText(droppoint, { x:157, y: 392, size: 12, color: rgb(0, 0, 0) });
// page.drawText(pickupdate, { x:157, y: 353, size: 12, color: rgb(0, 0, 0) });
// page.drawText(pickuptime, { x:157, y: 315, size: 12, color: rgb(0, 0, 0) });
// page.drawText(numofbags, { x:157, y: 276, size: 12, color: rgb(0, 0, 0) });  



  // const modifiedPdfBytes = await pdfDoc.save();
  
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
  
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Smart Cab point',
          html: `
    <div style="background-color: #f3f3f3; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
          <p style="color: #333; font-size: 18px;">Dear Customer,</p>
          <p style="color: #333; font-size: 16px;">Thank you for Booking at Smart cab Point!</p>
          <p style="color: #333; font-size: 16px;">Below is the information you requested:</p>
          <hr style="border: 1px solid #ccc;">
          <div style="background-color: #f3f3f3; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
             
              <div style="margin-top: 20px;">
                  <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
                  <ul style="list-style-type: none; padding-left: 0;">
                      <li><strong>Name:</strong> ${name}</li>
                      <li><strong>Email:</strong> ${email}</li>
                      <li><strong>Phone:</strong> ${mobile}</li>
                      <li><strong>Total Booking:</strong> ${numofpass}</li>
                      <li><strong>Pickup date:</strong> ${pickupdate}</li>
                      <li><strong>Pickup time:</strong> ${pickuptime}</li>
                      <li><strong>Pickup time:</strong> ${pickuppoint}</li>
                      <li><strong>Pickup time:</strong> ${droppoint}</li>
                      <li><strong>Pickup time:</strong> ${selecttaxi}</li>

                  </ul>
              </div>
             
          </div>
      </div>
          <hr style="border: 1px solid #ccc;">
          <p style="color: #333; font-size: 16px;">If you have any further questions or need assistance, feel free to contact us.</p>
          <p style="color: #666; font-size: 16px;">Best regards,</p>
          <p style="color: #666; font-size: 16px;">Smart Cab Point Team</p>
        
        
          <p style="color: #666; font-size: 16px; margin-top: 20px;"> Nizampura,Vadodara,india</p>
      </div>
  </div>
  
    `
        };


  
        const info = await transporter.sendMail(mailOptions);
  
        console.log('Email sent:', info.response);

        // const promises = matchingVehicles.map(async (matchingVehicle) => {
        //   const mailOptions1 = {
        //     from: process.env.EMAIL_USER,
        //     to: matchingVehicle.email,
        //     subject: 'Booking Received! Smart Cab point',
        //     html: `   <div style="margin-top: 20px;">
        //     <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
        //     <ul style="list-style-type: none; padding-left: 0;">
        //         <li><strong>Name:</strong> ${name}</li>
        //         <li><strong>Email:</strong> ${email}</li>
        //         <li><strong>Phone:</strong> ${mobile}</li>
        //         <li><strong>Total Booking:</strong> ${numofpass}</li>
        //         <li><strong>Pickup date:</strong> ${pickupdate}</li>
        //         <li><strong>Pickup time:</strong> ${pickuptime}</li>
        //         <li><strong>Pickup time:</strong> ${pickuppoint}</li>
        //         <li><strong>Pickup time:</strong> ${droppoint}</li>
        //         <li><strong>Pickup time:</strong> ${selecttaxi}</li>

        //     </ul>
        // </div>`, 
        //   };
        
        //   const info1 = await transporter.sendMail(mailOptions1);
        //   console.log('Email sent to:', matchingVehicle.email, info1.response);
        // });
        
        // // Wait for all emails to be sent
        // await Promise.all(promises);

        
  
  
        res.json({ success: true, message: 'Thanks Your Booking has been Confirmed' });
      });
    } catch (error) {
      console.error('Error during booking:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }



});


app.get('/book-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
    }

 

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // console.log('Decoded:', decoded);

      const user = await UserRegister.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }


      res.json({ bookInfo: user.book });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});













app.post('/register-vehicle', async (req, res) => {
  const { name,email,mobile,carname,carmodel,licensenumber,vehicleyear,vehiclecolor,city } = req.body;

  try {

    // Check if the user with the given licensenumber already exists
    const user = await vehicle.findOne({licensenumber});
   
  
    if (user) {
     
      return res.json({ success: false, error: 'licence number already registered' });
    }
    
 
  
      const result = await vehicle.create({
        name,email,mobile,carname,carmodel,licensenumber,vehicleyear,vehiclecolor,city
 
  
  });
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Smart Cab Point',
    html: `
    <p>Hello ${name},</p>
    <p>Thank you for registering with Smart Cab Point. We are thrilled to welcome you to our community!</p>
    <p>As a member, you can enjoy exclusive offers, discounts, and updates on our latest offerings.</p>
    <p>Stay tuned for exciting news and events!</p>
    <p>Best regards,</p>
    <p>Smart Cab Point Team</p>
  `,
  };


  
  const info =  await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);
  
    const mail = {
    from: process.env.EMAIL_USER,
    to: "himanshu0409agraval@gmail.com",
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
  
  res.json({ success: true, message: 'Thanks Vehicle Registration successfull' });
  console.log(result);
  
  
  
  
  
  
  }catch (error) {
    res.json({ success: false, error: 'not added' });
  }
  




      
})

app.get("/vehicle-info", async (req, res) => {
  try {
    const user = await vehicle.find();
    res.json({ success: true, data: user });
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