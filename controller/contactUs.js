const Contactus = require("../schema/contactUs");
const handleEmail = require("../utils/emailHandler");  //it used when responding to a "Contact Us" query.

const contactMessage = async (req, res) => {
  try {
    const contact = new Contactus({ ...req.body, status: false });
    const result = await contact.save();
    res.status(200).json({
      message: "Query submitted successfully",
      data: result,
    });
  } catch (e) {
    res.status(404).json(e);
  }
};

const getContact = async (req, res) => {  //This function retrieves all "Contact Us" messages from the database.
  try {
    const contact = await Contactus.find();
    const alterData = contact.map((item) => {
      return {
        _id: item._id,
        name: item.name,
        email: item.email,
        message: item.message,
        status: item.status === true ? "Answered" : "Pending",
      };
    });
    res.status(200).json({
      message: "Fetched successfully",
      data: alterData,
    });
  } catch (e) {
    res.status(404).json(e);
  }
};

const getQueryById = async (req, res) => {  // This function retrieves a specific "Contact Us" message by its ID.

  const { id } = req.params;
  try {
    const contact = await Contactus.findById({ _id: id });
    if (!contact) {
      res.status(200).json({
        message: "Invalid Id",
        data: contact,
        status: 402,
      });
      return;
    }
    res.status(200).json({
      message: "Fetched successfully",
      data: contact,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteQueryById = async (req, res) => { //This function deletes a specific "Contact Us" message by its ID.
  const { id } = req.params;
  try {
    const contact = await Contactus.findByIdAndDelete({ _id: id });
    res.status(200).json({
      message: "Deleted successfully",
      data: contact,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const sendEmailMessage = async (req, res) => { //This function sends an email reply to a "Contact Us" message and updates the query’s status to "answered."
  try {
    const { id, email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: "Enter Message and Email" });
    }

    const subject = "Contact Us Message";
    const text = `${message}
      `;

    const result = await handleEmail(email, subject, text);

    if (!result) {
      return res.status(400).json({ message: "Error: Email not sent" });
    }

    await Contactus.findByIdAndUpdate({ _id: id }, { status: true });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  contactMessage,
  getContact,
  getQueryById,
  deleteQueryById,
  sendEmailMessage,
};
