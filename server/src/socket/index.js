// import models here
const { chat, profile, user } = require("../../models");

const socketIo = (io) => {
  io.on("connection", (socket) => {
    console.log("client connect: ", socket.id);

    // code here
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findOne({
          where: { status: "admin" },
          include: [
            {
              model: "profile",
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });

        socket.emit("admin contact", adminContact);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("load customer contact", async () => {
      try {
        let customerContact = await user.findAll({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "	idSender", "idRecipient"],
              },
            },
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "	idSender", "idRecipient"],
              },
            },
          ],
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });

        customerContact = JSON.stringify(customerContact);
        customerContact.map((item) => ({
          ...item,
          image: item.image ? proccess.env.PATH_FILE + item.image : null,
        }));

        socket.emit("customer contact", customerContact);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnect");
    });
  });
};

module.exports = socketIo;
