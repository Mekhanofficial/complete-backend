require("dotenv").config();
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const otpStorage = new Map();

let transporter;

try{
    const smtpPort = Number(process.env.EMAIL_PORT) || 587;
    const smtpSecure = process.env.EMAIL_SECURE
        ? process.env.EMAIL_SECURE === "true"
        : smtpPort === 465;

    transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILSECRET,
        },
        connectionTimeout: 90000,
        greetingTimeout: 30000,
        socketTimeout: 90000,
    });
    console.log("Email transporter created successfully");
    console.log(`Email: ${process.env.EMAIL || "not set"}`);

    transporter.verify((error) => {
        if(error){
            console.log("Email configuration test failed:", error);
            console.log("Please check SMTP host/port/security and email credentials in .env.");
        }else{
            console.log("Email transporter verified successfully");
        }
    });
}catch(err){
    console.log("Email configuration error:", err);
    }


    function generateOTP(){
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Function to store OTP in memory
function storeOTP(email, otp){
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    otpStorage.set(email, {
        otp: otp,
        expiresAt: expiresAt,
        attempt:0
    });
    return expiresAt;
}

// send OTP email
async function sendOTPEmail(email, otp){
    if (!transporter) {
        throw new Error("Email transporter is not configured");
    }

    const fromName = process.env.EMAIL_FROM_NAME || "foodtrap";
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL;

    if (!fromAddress) {
        throw new Error("Sender email address is not configured");
    }

    const fromHeader = process.env.EMAIL_FROM || `"${fromName}" <${fromAddress}>`;

    const mailOptions = {
        from: fromHeader,
        replyTo: fromAddress,
        to: email,
        subject: "Your OTP Code",
        html: 
        `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #c6c2c2; border-radius: 5px; background-color: #f9f9f9;">
           <h2>Your OTP Code is</h2>
           <div style="background-color: #9c9ce9; padding:20px; text-align:center;border-radius:5px;">
           <h1 style="color: #313840; font-size:36px; margin:0;" >${otp}</h1>
           </div>
        </div>`,
        text: `Your OTP Code is: ${otp}. This code will expire in 10 minutes`
    };

    return await transporter.sendMail(mailOptions);
}

async function sendOTP(req, res){
  try{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            success: false,
            error: "Email is required"
        })
    }
    const otp = generateOTP();
    const expiryTime = storeOTP(email, otp)

    await sendOTPEmail(email, otp)
    return res.status(200).json({
        success: true,
        message: `OTP sent to ${email}, expires in 10 minutes`
    })
  }catch(error){
    console.log("Send OTP error:", error);
    return res.status(500).json({
        success: false,
        error: "failed to send otp"
    })
  }
}

async function verifyOTP(req, res){
    try{
        const {email, otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({
                success: false,
                error: "Email and OTP are required"
            })
        }
        const storedData = otpStorage.get(email);
        if(!storedData){
            return res.status(400).json({
                success: false,
                error: "No OTP found for this email"
            })
        }
        if (Date.now() > storedData.expiresAt) {
            otpStorage.delete(email);
            return res.status(400).json({
                success: false,
                error: "OTP has expired"
            });
        }
        if(storedData.otp !== otp){
            storedData.attempt = (storedData.attempt || 0) + 1;
            if(storedData.attempt >= 3){
                otpStorage.delete(email);
                return res.status(400).json({
                    success: false,
                    error: "Too many failed attempts. OTP has been invalidated."
                });
            }
            return res.status(400).json({
                success: false,
                error: "Invalid OTP"
            });
        }

        const jwtSecret = process.env.JWT_SECRET || process.env.JWTSECRET;

        if(!jwtSecret){
            return res.status(500).json({
                success: false,
                error: "JWT secret is not configured"
            });
        }

        const jwtToken = jwt.sign(
            {email: email},
            jwtSecret,
            {expiresIn: "1d"}
        );

        otpStorage.delete(email);
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token: jwtToken
        });


    }catch(error){
        console.log("Verify OTP error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to verify OTP"
        });
    }
}

module.exports = {sendOTP, verifyOTP};
