const z = require("zod");
const nodemailer = require("nodemailer");
const Agenda = require("agenda");

//time, email body, subject and an email address can be requested.
// MongoDB connection for Agenda
const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });



const scheduleInput = z.object({
    email: z.string().email(),
    subject: z.string(),
    emailBody: z.string(),
    time: z.string().default("in 1 Hour"),
})

// Define Agenda Job
agenda.define("sendEmail", async (job) => {
    const { email, subject, emailBody } = job.attrs.data;

    // Nodemailer Transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: emailBody,
    };

    try {

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email");
    }
});
const scheduleController = async (req, res) => {
    const result = scheduleInput.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid request", error: result.error.message });
    }

    const { email, subject, emailBody, time } = req.body;
    const userId = req.userId; 

    try {
        // Schedule the email job in 1 hour
        const job = await agenda.schedule("in 1 minute","sendEmail", {email, subject, emailBody, userId });


        // console.log(job);

 // Send an immediate response to the client
 return res.status(200).json({ 
    message: `Email scheduled successfully for ${time}`, 
    jobId:  job.attrs._id.toString() ||  "Job ID not found" 
});
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

        // Start Agenda Processing
        agenda.start();




module.exports = scheduleController

